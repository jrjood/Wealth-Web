import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { query } from '../lib/db.js';

const router = express.Router();

const normalizeString = (value) =>
  typeof value === 'string' ? value.trim() : '';

const mapProjectInquiry = (inquiry) => ({
  id: inquiry.id,
  name: inquiry.name,
  email: inquiry.email,
  phone: inquiry.phone,
  projectId: inquiry.projectId,
  projectTitle: inquiry.projectTitle || null,
  message: inquiry.message,
  createdAt: inquiry.createdAt,
  updatedAt: inquiry.updatedAt,
});

router.post('/', async (req, res) => {
  const { name, email, phone, projectId, message } = req.body ?? {};
  const normalizedName = normalizeString(name);
  const normalizedEmail = normalizeString(email);
  const normalizedPhone = normalizeString(phone);
  const normalizedProjectId = normalizeString(projectId);
  const normalizedMessage = normalizeString(message);
  const errors = [];

  if (!normalizedName) errors.push('name');
  if (!normalizedEmail) errors.push('email');
  if (!normalizedPhone) errors.push('phone');
  if (!normalizedProjectId) errors.push('projectId');

  if (normalizedEmail) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(normalizedEmail)) {
      errors.push('email');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Missing or invalid fields',
      fields: Array.from(new Set(errors)),
    });
  }

  try {
    const projectRows = await query(
      'SELECT id, title FROM `Project` WHERE id = ? LIMIT 1',
      [normalizedProjectId],
    );
    const project = projectRows[0];

    if (!project) {
      return res
        .status(400)
        .json({ error: 'Selected project is no longer available.' });
    }

    const inquiryId = `inq_${Date.now()}_${Math.round(Math.random() * 1e6)}`;

    await query(
      'INSERT INTO `ProjectInquiry` (id, name, email, phone, projectId, projectTitle, message, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [
        inquiryId,
        normalizedName,
        normalizedEmail,
        normalizedPhone,
        project.id,
        project.title,
        normalizedMessage || `Project inquiry for ${project.title}.`,
      ],
    );

    res.status(201).json({ ok: true, inquiryId });
  } catch (error) {
    console.error('Failed to store project inquiry:', error);
    res.status(500).json({
      error: 'Failed to submit inquiry. Please try again shortly.',
    });
  }
});

router.use(authMiddleware);

router.get('/admin/all', async (_req, res) => {
  try {
    const rows = await query(
      `SELECT
        pi.id,
        pi.name,
        pi.email,
        pi.phone,
        pi.projectId,
        COALESCE(pi.projectTitle, p.title) AS projectTitle,
        pi.message,
        pi.createdAt,
        pi.updatedAt
      FROM \`ProjectInquiry\` pi
      LEFT JOIN \`Project\` p ON p.id = pi.projectId
      ORDER BY pi.createdAt DESC`,
    );

    res.json(rows.map(mapProjectInquiry));
  } catch (error) {
    console.error('Error fetching project inquiries:', error);
    if (error.message?.includes('Database not configured')) {
      return res.json([]);
    }
    res.status(500).json({ error: 'Failed to fetch project inquiries' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM `ProjectInquiry` WHERE id = ?', [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project inquiry not found' });
    }

    res.json({ message: 'Project inquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting project inquiry:', error);
    res.status(500).json({ error: 'Failed to delete project inquiry' });
  }
});

export default router;
