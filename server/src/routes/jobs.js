import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { query } from '../lib/db.js';

const router = express.Router();

const toBoolean = (value) => value === 1 || value === true || value === '1';

const mapJob = (job) => ({
  ...job,
  published: toBoolean(job.published),
});

const buildJobWhere = ({ department, type, publishedOnly = true }) => {
  const clauses = [];
  const params = [];

  if (publishedOnly) {
    clauses.push('published = 1');
  }

  if (department) {
    clauses.push('department = ?');
    params.push(department);
  }

  if (type) {
    clauses.push('type = ?');
    params.push(type);
  }

  return {
    whereSql: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '',
    params,
  };
};

// Public route - Get all published jobs
router.get('/', async (req, res) => {
  try {
    const { department, type } = req.query;
    const { whereSql, params } = buildJobWhere({ department, type });

    const jobs = await query(
      `SELECT id, title, department, location, type, description, published, createdAt, updatedAt FROM \`Job\` ${whereSql} ORDER BY createdAt DESC`,
      params,
    );

    res.json(jobs.map(mapJob));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    if (error.message?.includes('Database not configured')) {
      return res.json([]);
    }
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Public route - Get single job
router.get('/:id', async (req, res) => {
  try {
    const rows = await query(
      'SELECT id, title, department, location, type, description, published, createdAt, updatedAt FROM `Job` WHERE id = ? LIMIT 1',
      [req.params.id],
    );

    const job = rows[0];

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(mapJob(job));
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

router.use(authMiddleware);

// Get all jobs (including unpublished) - Admin only
router.get('/admin/all', async (_req, res) => {
  try {
    const jobs = await query(
      'SELECT id, title, department, location, type, description, published, createdAt, updatedAt FROM `Job` ORDER BY createdAt DESC',
    );

    res.json(jobs.map(mapJob));
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Create new job
router.post('/', async (req, res) => {
  try {
    const { id, title, department, location, type, description, published } =
      req.body;

    if (!title || !department || !location || !type || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const insertId = id || `job_${Date.now()}`;
    await query(
      'INSERT INTO `Job` (id, title, department, location, type, description, published) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        insertId,
        title,
        department,
        location,
        type,
        description,
        published ?? 1,
      ],
    );

    const rows = await query(
      'SELECT id, title, department, location, type, description, published, createdAt, updatedAt FROM `Job` WHERE id = ? LIMIT 1',
      [insertId],
    );

    res.status(201).json(mapJob(rows[0]));
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// Update job
router.put('/:id', async (req, res) => {
  try {
    const { title, department, location, type, description, published } =
      req.body;

    const existingRows = await query(
      'SELECT id FROM `Job` WHERE id = ? LIMIT 1',
      [req.params.id],
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    await query(
      'UPDATE `Job` SET title = ?, department = ?, location = ?, type = ?, description = ?, published = ? WHERE id = ?',
      [
        title,
        department,
        location,
        type,
        description,
        published ?? 0,
        req.params.id,
      ],
    );

    const rows = await query(
      'SELECT id, title, department, location, type, description, published, createdAt, updatedAt FROM `Job` WHERE id = ? LIMIT 1',
      [req.params.id],
    );

    res.json(mapJob(rows[0]));
  } catch (error) {
    console.error('Error updating job:', error);

    res.status(500).json({ error: 'Failed to update job' });
  }
});

// Delete job
router.delete('/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM `Job` WHERE id = ?', [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

export default router;
