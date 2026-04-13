import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { query } from '../lib/db.js';

const router = express.Router();

const toBoolean = (value) => value === 1 || value === true || value === '1';

const mapProject = (project) => ({
  ...project,
  featured: toBoolean(project.featured),
});

const buildProjectWhere = ({ type, status, featured }) => {
  const clauses = [];
  const params = [];

  if (type) {
    clauses.push('type = ?');
    params.push(type);
  }

  if (status) {
    clauses.push('status = ?');
    params.push(status);
  }

  if (featured === 'true') {
    clauses.push('featured = 1');
  }

  return {
    whereSql: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '',
    params,
  };
};

// Public route - Get all published projects
router.get('/', async (req, res) => {
  try {
    const { type, status, featured } = req.query;
    const { whereSql, params } = buildProjectWhere({ type, status, featured });

    const projects = await query(
      `SELECT id, title, location, type, status, description, details, imageUrl, featured, amenities, specifications, createdAt, updatedAt FROM \`Project\` ${whereSql} ORDER BY createdAt DESC`,
      params,
    );

    res.json(projects.map(mapProject));
  } catch (error) {
    console.error('Error fetching projects:', error);
    if (error.message?.includes('Database not configured')) {
      return res.json([]);
    }
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Public route - Get single project by ID
router.get('/:id', async (req, res) => {
  try {
    const rows = await query(
      'SELECT id, title, location, type, status, description, details, imageUrl, featured, amenities, specifications, createdAt, updatedAt FROM `Project` WHERE id = ? LIMIT 1',
      [req.params.id],
    );

    const project = rows[0];

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(mapProject(project));
  } catch (error) {
    console.error('Error fetching project:', error);
    if (error.message?.includes('Database not configured')) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

router.use(authMiddleware);

// Create new project
router.post('/', async (req, res) => {
  try {
    const {
      id,
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

    const insertId = id || `prj_${Date.now()}`;
    await query(
      'INSERT INTO `Project` (id, title, location, type, status, description, details, imageUrl, featured, amenities, specifications) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        insertId,
        title,
        location,
        type,
        status,
        description,
        details || null,
        imageUrl || null,
        featured ? 1 : 0,
        amenities || null,
        specifications || null,
      ],
    );

    const rows = await query(
      'SELECT id, title, location, type, status, description, details, imageUrl, featured, amenities, specifications, createdAt, updatedAt FROM `Project` WHERE id = ? LIMIT 1',
      [insertId],
    );

    res.status(201).json(mapProject(rows[0]));
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

    const existingRows = await query(
      'SELECT id FROM `Project` WHERE id = ? LIMIT 1',
      [req.params.id],
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await query(
      'UPDATE `Project` SET title = ?, location = ?, type = ?, status = ?, description = ?, details = ?, imageUrl = ?, featured = ?, amenities = ?, specifications = ? WHERE id = ?',
      [
        title,
        location,
        type,
        status,
        description,
        details || null,
        imageUrl || null,
        featured ? 1 : 0,
        amenities || null,
        specifications || null,
        req.params.id,
      ],
    );

    const rows = await query(
      'SELECT id, title, location, type, status, description, details, imageUrl, featured, amenities, specifications, createdAt, updatedAt FROM `Project` WHERE id = ? LIMIT 1',
      [req.params.id],
    );

    res.json(mapProject(rows[0]));
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM `Project` WHERE id = ?', [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
