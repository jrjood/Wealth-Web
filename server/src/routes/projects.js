import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public route - Get all published projects
router.get('/', async (req, res) => {
  try {
    const { type, status, featured } = req.query;

    const where = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (featured === 'true') where.featured = true;

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Return empty array if database is not configured
    if (
      error.code === 'P1001' ||
      error.message.includes("Can't reach database")
    ) {
      console.log('Database not available - returning empty array');
      return res.json([]);
    }
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Public route - Get single project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    // Return 404 if database is not available
    if (
      error.code === 'P1001' ||
      error.message.includes("Can't reach database")
    ) {
      console.log('Database not available');
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Protected routes below - require authentication
router.use(authMiddleware);

// Create new project
router.post('/', async (req, res) => {
  try {
    const {
      title,
      location,
      type,
      status,
      description,
      details,
      imageUrl,
      featured,
      amenities,
      specifications,
    } = req.body;

    if (!title || !location || !type || !status || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const project = await prisma.project.create({
      data: {
        title,
        location,
        type,
        status,
        description,
        details,
        imageUrl,
        featured: featured || false,
        amenities,
        specifications,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const {
      title,
      location,
      type,
      status,
      description,
      details,
      imageUrl,
      featured,
      amenities,
      specifications,
    } = req.body;

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        title,
        location,
        type,
        status,
        description,
        details,
        imageUrl,
        featured,
        amenities,
        specifications,
      },
    });

    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    await prisma.project.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
