import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const uploadRoot = path.resolve(process.cwd(), 'uploads', 'job-applications');

fs.mkdirSync(uploadRoot, { recursive: true });

const allowedMimeTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const allowedExtensions = new Set(['.pdf', '.doc', '.docx']);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadRoot);
  },
  filename: (_req, file, callback) => {
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`;
    callback(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const mimeAllowed = allowedMimeTypes.has(file.mimetype);
    const extensionAllowed = allowedExtensions.has(extension);

    if (!mimeAllowed && !extensionAllowed) {
      callback(new Error('Only PDF, DOC, and DOCX files are allowed'));
      return;
    }

    callback(null, true);
  },
});

const normalizeEmail = (value) =>
  typeof value === 'string' ? value.trim() : '';

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

const sendApplicationEmail = async ({ application, attachmentPath }) => {
  const transporter = createMailTransport();

  if (!transporter) {
    return { emailSent: false, reason: 'SMTP not configured' };
  }

  const hrEmail = process.env.HR_EMAIL || 'hr@wealthholding-eg.com';
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || hrEmail;

  await transporter.sendMail({
    to: hrEmail,
    from: fromAddress,
    subject: `New job application: ${application.jobTitle}`,
    text: [
      `A new job application has been submitted.`,
      ``,
      `Name: ${application.name}`,
      `Email: ${application.email}`,
      `Phone: ${application.phone}`,
      `Position: ${application.jobTitle}`,
      `Department: ${application.jobDepartment || 'General'}`,
      `Location: ${application.jobLocation || 'N/A'}`,
      `Type: ${application.jobType || 'N/A'}`,
      `Status: ${application.status}`,
      ``,
      `Message:`,
      application.message || 'No cover letter provided.',
    ].join('\n'),
    attachments: [
      {
        filename: application.cvOriginalName,
        path: attachmentPath,
      },
    ],
  });

  return { emailSent: true };
};

const parseStatus = (value) => {
  const allowedStatuses = new Set([
    'new',
    'in_review',
    'shortlisted',
    'rejected',
    'hired',
  ]);
  if (!allowedStatuses.has(value)) {
    return null;
  }

  return value;
};

router.post('/', (req, res) => {
  upload.single('cv')(req, res, async (error) => {
    if (error) {
      if (
        error instanceof multer.MulterError &&
        error.code === 'LIMIT_FILE_SIZE'
      ) {
        return res
          .status(413)
          .json({ error: 'CV file must be 20MB or smaller' });
      }

      return res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : 'Unable to process uploaded CV',
      });
    }

    try {
      const { name, email, phone, message, jobId, jobTitle } = req.body ?? {};
      const normalizedName = typeof name === 'string' ? name.trim() : '';
      const normalizedEmail = normalizeEmail(email);
      const normalizedPhone = typeof phone === 'string' ? phone.trim() : '';
      const normalizedMessage =
        typeof message === 'string' ? message.trim() : '';
      const normalizedJobId = typeof jobId === 'string' ? jobId.trim() : '';
      const normalizedJobTitle =
        typeof jobTitle === 'string' ? jobTitle.trim() : '';

      if (!normalizedName || !normalizedEmail || !normalizedPhone) {
        return res
          .status(400)
          .json({ error: 'Missing required applicant fields' });
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(normalizedEmail)) {
        return res.status(400).json({ error: 'Invalid email address' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'CV file is required' });
      }

      const job =
        normalizedJobId && normalizedJobId !== 'general'
          ? await prisma.job.findUnique({ where: { id: normalizedJobId } })
          : null;

      if (normalizedJobId && normalizedJobId !== 'general' && !job) {
        return res.status(404).json({ error: 'Selected job not found' });
      }

      const application = await prisma.jobApplication.create({
        data: {
          cvMimeType: req.file.mimetype,
          cvOriginalName: req.file.originalname,
          cvSize: req.file.size,
          cvStoredName: req.file.filename,
          email: normalizedEmail,
          jobDepartment: job?.department || null,
          jobId: job?.id || null,
          jobLocation: job?.location || null,
          jobTitle: job?.title || normalizedJobTitle || 'General Application',
          jobType: job?.type || null,
          message: normalizedMessage || null,
          name: normalizedName,
          phone: normalizedPhone,
          status: 'new',
        },
      });

      let emailSent = false;
      let emailError = null;

      try {
        const attachmentPath = path.join(uploadRoot, req.file.filename);
        const result = await sendApplicationEmail({
          application,
          attachmentPath,
        });
        emailSent = result.emailSent;
      } catch (sendError) {
        emailError =
          sendError instanceof Error
            ? sendError.message
            : 'Failed to send email';
        console.error('Failed to send job application email:', sendError);
      }

      res.status(201).json({
        application,
        emailError,
        emailSent,
      });
    } catch (submitError) {
      console.error('Error creating job application:', submitError);

      if (
        submitError instanceof Error &&
        submitError.message.includes(
          'Only PDF, DOC, and DOCX files are allowed',
        )
      ) {
        return res.status(400).json({ error: submitError.message });
      }

      res.status(500).json({ error: 'Failed to submit job application' });
    }
  });
});

router.use(authMiddleware);

router.get('/admin/all', async (_req, res) => {
  try {
    const applications = await prisma.jobApplication.findMany({
      include: { job: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ error: 'Failed to fetch job applications' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const status = parseStatus(req.body?.status);

    if (!status) {
      return res.status(400).json({ error: 'Invalid application status' });
    }

    const application = await prisma.jobApplication.update({
      where: { id: req.params.id },
      data: { status },
      include: { job: true },
    });

    res.json(application);
  } catch (error) {
    console.error('Error updating job application:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Job application not found' });
    }

    res.status(500).json({ error: 'Failed to update job application' });
  }
});

router.get('/:id/cv', async (req, res) => {
  try {
    const application = await prisma.jobApplication.findUnique({
      where: { id: req.params.id },
    });

    if (!application) {
      return res.status(404).json({ error: 'Job application not found' });
    }

    const cvPath = path.join(uploadRoot, application.cvStoredName);
    res.download(cvPath, application.cvOriginalName, (error) => {
      if (error && !res.headersSent) {
        res.status(404).json({ error: 'CV file not found' });
      }
    });
  } catch (error) {
    console.error('Error downloading CV:', error);
    res.status(500).json({ error: 'Failed to download CV' });
  }
});

export default router;
