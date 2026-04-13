import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import authRoutes from './routes/auth.js';
import projectsRoutes from './routes/projects.js';
import jobsRoutes from './routes/jobs.js';
import jobApplicationsRoutes from './routes/jobApplications.js';
import postsRoutes from './routes/posts.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3001;
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/job-applications', jobApplicationsRoutes);
app.use('/api/posts', postsRoutes);

const createMailTransport = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    auth: {
      pass,
      user,
    },
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
  });
};

const sendContactEmail = async ({ name, email, phone, project, message }) => {
  const transporter = createMailTransport();
  if (!transporter) {
    throw new Error('SMTP not configured');
  }

  const hrEmail = process.env.HR_EMAIL || 'hr@wealthholding-eg.com';
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || hrEmail;

  await transporter.sendMail({
    from: fromAddress,
    replyTo: email,
    subject: `New contact request from ${name}`,
    text: [
      'A new contact form message was submitted.',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Project: ${project || 'Not specified'}`,
      '',
      'Message:',
      message,
    ].join('\n'),
    to: hrEmail,
  });
};

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, project, message } = req.body ?? {};
  const errors = [];

  if (!name || typeof name !== 'string') errors.push('name');
  if (!email || typeof email !== 'string') errors.push('email');
  if (!phone || typeof phone !== 'string') errors.push('phone');
  if (!message || typeof message !== 'string') errors.push('message');

  if (email && typeof email === 'string') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      errors.push('email');
    }
  }

  if (errors.length > 0) {
    res.status(400).json({
      error: 'Missing or invalid fields',
      fields: Array.from(new Set(errors)),
    });
    return;
  }

  const normalizedName = name.trim();
  const normalizedEmail = email.trim();
  const normalizedPhone = phone.trim();
  const normalizedProject = typeof project === 'string' ? project.trim() : '';
  const normalizedMessage = message.trim();

  try {
    await sendContactEmail({
      name: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      project: normalizedProject,
      message: normalizedMessage,
    });
  } catch (sendError) {
    console.error('Failed to send contact email:', sendError);
    res.status(500).json({
      error:
        sendError instanceof Error &&
        sendError.message === 'SMTP not configured'
          ? 'Email service is not configured yet.'
          : 'Failed to deliver message. Please try again shortly.',
    });
    return;
  }

  console.log('Contact request received', {
    name: normalizedName,
    email: normalizedEmail,
    phone: normalizedPhone,
    project: normalizedProject,
  });

  res.json({ ok: true, delivered: true });
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});

// Prevent process from exiting on unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
