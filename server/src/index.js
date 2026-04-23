import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import { query } from './lib/db.js';
import contactMessagesRoutes from './routes/contactMessages.js';
import projectsRoutes from './routes/projects.js';
import jobsRoutes from './routes/jobs.js';
import jobApplicationsRoutes from './routes/jobApplications.js';
import postsRoutes from './routes/posts.js';
import projectInquiriesRoutes from './routes/projectInquiries.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3001;
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

if (isProduction && allowedOrigins.length === 0) {
  throw new Error('CORS_ORIGIN must be set in production.');
}

app.use(
  cors({
    credentials: true,
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
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/job-applications', jobApplicationsRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/contact-messages', contactMessagesRoutes);
app.use('/api/project-inquiries', projectInquiriesRoutes);

const ensureContactMessagesTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS \`ContactMessage\` (
      \`id\` VARCHAR(191) NOT NULL,
      \`name\` VARCHAR(191) NOT NULL,
      \`email\` VARCHAR(191) NOT NULL,
      \`phone\` VARCHAR(191) NOT NULL,
      \`projectId\` VARCHAR(191) NULL,
      \`projectTitle\` VARCHAR(191) NULL,
      \`message\` TEXT NOT NULL,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL,

      INDEX \`ContactMessage_projectId_idx\`(\`projectId\`),
      INDEX \`ContactMessage_createdAt_idx\`(\`createdAt\`),
      PRIMARY KEY (\`id\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);

  await query(`
    ALTER TABLE \`ContactMessage\`
      ADD CONSTRAINT \`ContactMessage_projectId_fkey\`
      FOREIGN KEY (\`projectId\`) REFERENCES \`Project\`(\`id\`)
      ON DELETE SET NULL ON UPDATE CASCADE
  `).catch((error) => {
    if (
      !String(error?.message || '').includes(
        'Duplicate foreign key constraint name',
      )
    ) {
      throw error;
    }
  });
};

const ensureProjectDetailSchema = async () => {
  await query(`
    ALTER TABLE \`Project\`
      ADD COLUMN IF NOT EXISTS \`masterPlanImage\` VARCHAR(191) NULL AFTER \`imageUrl\`,
      ADD COLUMN IF NOT EXISTS \`projectLogoUrl\` VARCHAR(191) NULL AFTER \`imageUrl\`,
      ADD COLUMN IF NOT EXISTS \`videoUrl\` VARCHAR(191) NULL AFTER \`masterPlanImage\`,
      ADD COLUMN IF NOT EXISTS \`locationImage\` VARCHAR(191) NULL AFTER \`videoUrl\`,
      ADD COLUMN IF NOT EXISTS \`locationMapUrl\` VARCHAR(512) NULL AFTER \`locationImage\`,
      ADD COLUMN IF NOT EXISTS \`brochureUrl\` VARCHAR(191) NULL AFTER \`locationMapUrl\`
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS \`GalleryImage\` (
      \`id\` VARCHAR(191) NOT NULL,
      \`projectId\` VARCHAR(191) NOT NULL,
      \`imageUrl\` VARCHAR(191) NOT NULL,
      \`title\` VARCHAR(191) NULL,
      \`sortOrder\` INT NOT NULL DEFAULT 0,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL,

      INDEX \`GalleryImage_projectId_idx\`(\`projectId\`),
      INDEX \`GalleryImage_sortOrder_idx\`(\`sortOrder\`),
      PRIMARY KEY (\`id\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS \`NearbyLocation\` (
      \`id\` VARCHAR(191) NOT NULL,
      \`projectId\` VARCHAR(191) NOT NULL,
      \`name\` VARCHAR(191) NOT NULL,
      \`distance\` VARCHAR(191) NOT NULL,
      \`sortOrder\` INT NOT NULL DEFAULT 0,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL,

      INDEX \`NearbyLocation_projectId_idx\`(\`projectId\`),
      INDEX \`NearbyLocation_sortOrder_idx\`(\`sortOrder\`),
      PRIMARY KEY (\`id\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);

  await query(`
    ALTER TABLE \`GalleryImage\`
      ADD COLUMN IF NOT EXISTS \`title\` VARCHAR(191) NULL AFTER \`imageUrl\`
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS \`PaymentPlan\` (
      \`id\` VARCHAR(191) NOT NULL,
      \`projectId\` VARCHAR(191) NOT NULL,
      \`downPayment\` VARCHAR(191) NOT NULL,
      \`installments\` VARCHAR(191) NOT NULL,
      \`startingPrice\` VARCHAR(191) NOT NULL,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL,

      UNIQUE INDEX \`PaymentPlan_projectId_key\`(\`projectId\`),
      PRIMARY KEY (\`id\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);

  await query(`
    ALTER TABLE \`PaymentPlan\`
      ADD COLUMN IF NOT EXISTS \`installments\` VARCHAR(191) NULL AFTER \`downPayment\`,
      ADD COLUMN IF NOT EXISTS \`startingPrice\` VARCHAR(191) NULL AFTER \`installments\`
  `);

  await query(`
    UPDATE \`PaymentPlan\`
    SET
      \`installments\` = COALESCE(NULLIF(\`installments\`, ''), \`installmentYears\`, ''),
      \`startingPrice\` = COALESCE(NULLIF(\`startingPrice\`, ''), '')
  `).catch(() => {});

  await query(`
    ALTER TABLE \`PaymentPlan\`
      MODIFY COLUMN \`installments\` VARCHAR(191) NOT NULL,
      MODIFY COLUMN \`startingPrice\` VARCHAR(191) NOT NULL
  `);

  await query(`
    ALTER TABLE \`PaymentPlan\`
      DROP COLUMN IF EXISTS \`installmentYears\`,
      DROP COLUMN IF EXISTS \`installmentDetails\`
  `).catch(() => {});

  await query(`
    ALTER TABLE \`GalleryImage\`
      ADD CONSTRAINT \`GalleryImage_projectId_fkey\`
      FOREIGN KEY (\`projectId\`) REFERENCES \`Project\`(\`id\`)
      ON DELETE CASCADE ON UPDATE CASCADE
  `).catch((error) => {
    if (
      !String(error?.message || '').includes(
        'Duplicate foreign key constraint name',
      )
    ) {
      throw error;
    }
  });

  await query(`
    ALTER TABLE \`NearbyLocation\`
      ADD CONSTRAINT \`NearbyLocation_projectId_fkey\`
      FOREIGN KEY (\`projectId\`) REFERENCES \`Project\`(\`id\`)
      ON DELETE CASCADE ON UPDATE CASCADE
  `).catch((error) => {
    if (
      !String(error?.message || '').includes(
        'Duplicate foreign key constraint name',
      )
    ) {
      throw error;
    }
  });

  await query(`
    ALTER TABLE \`PaymentPlan\`
      ADD CONSTRAINT \`PaymentPlan_projectId_fkey\`
      FOREIGN KEY (\`projectId\`) REFERENCES \`Project\`(\`id\`)
      ON DELETE CASCADE ON UPDATE CASCADE
  `).catch((error) => {
    if (
      !String(error?.message || '').includes(
        'Duplicate foreign key constraint name',
      )
    ) {
      throw error;
    }
  });
};

const ensureProjectInquiriesTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS \`ProjectInquiry\` (
      \`id\` VARCHAR(191) NOT NULL,
      \`name\` VARCHAR(191) NOT NULL,
      \`email\` VARCHAR(191) NOT NULL,
      \`phone\` VARCHAR(191) NOT NULL,
      \`projectId\` VARCHAR(191) NOT NULL,
      \`projectTitle\` VARCHAR(191) NULL,
      \`message\` TEXT NOT NULL,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL,

      INDEX \`ProjectInquiry_projectId_idx\`(\`projectId\`),
      INDEX \`ProjectInquiry_createdAt_idx\`(\`createdAt\`),
      PRIMARY KEY (\`id\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);

  await query(`
    ALTER TABLE \`ProjectInquiry\`
      ADD CONSTRAINT \`ProjectInquiry_projectId_fkey\`
      FOREIGN KEY (\`projectId\`) REFERENCES \`Project\`(\`id\`)
      ON DELETE CASCADE ON UPDATE CASCADE
  `).catch((error) => {
    if (
      !String(error?.message || '').includes(
        'Duplicate foreign key constraint name',
      )
    ) {
      throw error;
    }
  });
};

void ensureContactMessagesTable().catch((error) => {
  console.error('Failed to ensure contact messages table:', error);
});

void ensureProjectInquiriesTable().catch((error) => {
  console.error('Failed to ensure project inquiries table:', error);
});

void ensureProjectDetailSchema().catch((error) => {
  console.error('Failed to ensure project detail schema:', error);
});

const normalizeString = (value) =>
  typeof value === 'string' ? value.trim() : '';

const resolveContactProject = async ({ projectId, project }) => {
  const candidate = normalizeString(projectId || project);

  if (
    !candidate ||
    candidate === 'general' ||
    candidate === 'General inquiry'
  ) {
    return { projectId: null, projectTitle: null };
  }

  const rows = await query(
    'SELECT id, title FROM `Project` WHERE id = ? OR title = ? LIMIT 1',
    [candidate, candidate],
  );

  const matchedProject = rows[0];

  if (!matchedProject) {
    throw new Error('Selected project not found');
  }

  return {
    projectId: matchedProject.id,
    projectTitle: matchedProject.title,
  };
};

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, projectId, project, message } = req.body ?? {};
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
  const normalizedMessage = message.trim();

  try {
    const resolvedProject = await resolveContactProject({ projectId, project });
    const messageId = `msg_${Date.now()}_${Math.round(Math.random() * 1e6)}`;

    await query(
      'INSERT INTO `ContactMessage` (id, name, email, phone, projectId, projectTitle, message, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [
        messageId,
        normalizedName,
        normalizedEmail,
        normalizedPhone,
        resolvedProject.projectId,
        resolvedProject.projectTitle,
        normalizedMessage,
      ],
    );
  } catch (error) {
    console.error('Failed to store contact message:', error);
    if (
      error instanceof Error &&
      error.message === 'Selected project not found'
    ) {
      res
        .status(400)
        .json({ error: 'Selected project is no longer available.' });
      return;
    }

    res.status(500).json({
      error: 'Failed to submit message. Please try again shortly.',
    });
    return;
  }

  console.log('Contact request received', {
    name: normalizedName,
    email: normalizedEmail,
    phone: normalizedPhone,
    projectId: typeof projectId === 'string' ? projectId.trim() : '',
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
