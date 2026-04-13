import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public route - Get all published jobs
router.get('/', async (req, res) => {
  try {
    const { department, type } = req.query;

    const where = { published: true };
    if (department) where.department = department;
    if (type) where.type = type;

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    // Return empty array if database is not configured
    if (error.code === 'P1001' || error.message.includes('Can\'t reach database')) {
      console.log('Database not available - returning empty array');
      return res.json([]);
    }
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Public route - Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id },
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// Protected routes below - require authentication
router.use(authMiddleware);

// Get all jobs (including unpublished) - Admin only
router.get('/admin/all', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Create new job
router.post('/', async (req, res) => {
  try {
    const { title, department, location, type, description, published } =
      req.body;

    if (!title || !department || !location || !type || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const job = await prisma.job.create({
      data: {
        title,
        department,
        location,
        type,
        description,
        published: published ?? true,
      },
    });

    res.status(201).json(job);
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

    const job = await prisma.job.update({
      where: { id: req.params.id },
      data: { title, department, location, type, description, published },
    });

    res.json(job);
  } catch (error) {
    console.error('Error updating job:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(500).json({ error: 'Failed to update job' });
  }
});

// Delete job
router.delete('/:id', async (req, res) => {
  try {
    await prisma.job.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(500).json({ error: 'Failed to delete job' });
  }
});

export default router;
