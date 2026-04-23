import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../lib/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const MAX_FAILED_ATTEMPTS = Number(process.env.AUTH_MAX_ATTEMPTS || 5);
const ATTEMPT_WINDOW_MS = Number(
  process.env.AUTH_ATTEMPT_WINDOW_MS || 15 * 60 * 1000,
);
const LOCKOUT_MS = Number(process.env.AUTH_LOCKOUT_MS || 15 * 60 * 1000);
const isProduction = process.env.NODE_ENV === 'production';
const cookieDomain = process.env.AUTH_COOKIE_DOMAIN?.trim() || undefined;
const cookieSameSite =
  process.env.AUTH_COOKIE_SAME_SITE || (isProduction ? 'strict' : 'lax');
const cookieSecure =
  process.env.AUTH_COOKIE_SECURE === 'true' ||
  (process.env.AUTH_COOKIE_SECURE !== 'false' && isProduction);

const attemptsByKey = new Map();

const getClientIp = (req) => {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (typeof xForwardedFor === 'string' && xForwardedFor.trim()) {
    return xForwardedFor.split(',')[0].trim();
  }

  if (Array.isArray(xForwardedFor) && xForwardedFor.length > 0) {
    return String(xForwardedFor[0]).trim();
  }

  return req.ip || req.socket?.remoteAddress || 'unknown';
};

const getAttemptKey = (req, email) => {
  const normalizedEmail =
    typeof email === 'string' ? email.trim().toLowerCase() : '';
  return `${getClientIp(req)}:${normalizedEmail || 'unknown'}`;
};

const getAttemptState = (key) => {
  const now = Date.now();
  const current = attemptsByKey.get(key);

  if (!current) {
    return {
      count: 0,
      firstAttemptAt: now,
      lockedUntil: 0,
    };
  }

  if (current.lockedUntil && current.lockedUntil <= now) {
    attemptsByKey.delete(key);
    return {
      count: 0,
      firstAttemptAt: now,
      lockedUntil: 0,
    };
  }

  if (now - current.firstAttemptAt > ATTEMPT_WINDOW_MS) {
    attemptsByKey.delete(key);
    return {
      count: 0,
      firstAttemptAt: now,
      lockedUntil: 0,
    };
  }

  return current;
};

const registerFailedAttempt = (key) => {
  const now = Date.now();
  const state = getAttemptState(key);
  const nextCount = state.count + 1;
  const lockedUntil = nextCount >= MAX_FAILED_ATTEMPTS ? now + LOCKOUT_MS : 0;

  attemptsByKey.set(key, {
    count: nextCount,
    firstAttemptAt: state.firstAttemptAt || now,
    lockedUntil,
  });

  return {
    count: nextCount,
    lockedUntil,
  };
};

const clearAttemptState = (key) => {
  attemptsByKey.delete(key);
};

const setAuthCookie = (res, token) => {
  res.cookie('admin_token', token, {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: cookieSameSite,
    domain: cookieDomain,
    path: '/',
    maxAge: 24 * 60 * 60 * 1000,
  });
};

const clearAuthCookie = (res) => {
  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: cookieSameSite,
    domain: cookieDomain,
    path: '/',
  });
};

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const attemptKey = getAttemptKey(req, email);
    const attemptState = getAttemptState(attemptKey);

    if (attemptState.lockedUntil && attemptState.lockedUntil > Date.now()) {
      const retryAfterSeconds = Math.ceil(
        (attemptState.lockedUntil - Date.now()) / 1000,
      );
      res.setHeader('Retry-After', String(retryAfterSeconds));
      return res.status(429).json({
        error: 'Too many failed login attempts. Try again later.',
      });
    }

    const rows = await query(
      'SELECT id, email, password, name FROM `Admin` WHERE email = ? LIMIT 1',
      [email],
    );

    const admin = rows[0];

    if (!admin) {
      registerFailedAttempt(attemptKey);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      registerFailedAttempt(attemptKey);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    clearAttemptState(attemptKey);

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
    );

    setAuthCookie(res, token);

    res.json({
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const rows = await query(
      'SELECT id, email, name FROM `Admin` WHERE id = ? LIMIT 1',
      [req.adminId],
    );

    const admin = rows[0];

    if (!admin) {
      return res.status(401).json({ error: 'Session invalid' });
    }

    res.json({
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error('Auth me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  res.status(204).send();
});

export default router;
