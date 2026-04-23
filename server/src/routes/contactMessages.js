import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { query } from '../lib/db.js';

const router = express.Router();

const mapContactMessage = (message) => ({
  id: message.id,
  name: message.name,
  email: message.email,
  phone: message.phone,
  projectId: message.projectId,
  projectTitle: message.projectTitle || null,
  message: message.message,
  createdAt: message.createdAt,
  updatedAt: message.updatedAt,
});

router.use(authMiddleware);

router.get('/admin/all', async (_req, res) => {
  try {
    const rows = await query(
      `SELECT
        cm.id,
        cm.name,
        cm.email,
        cm.phone,
        cm.projectId,
        COALESCE(cm.projectTitle, p.title) AS projectTitle,
        cm.message,
        cm.createdAt,
        cm.updatedAt
      FROM \`ContactMessage\` cm
      LEFT JOIN \`Project\` p ON p.id = cm.projectId
      ORDER BY cm.createdAt DESC`,
    );

    res.json(rows.map(mapContactMessage));
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    if (error.message?.includes('Database not configured')) {
      return res.json([]);
    }
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM `ContactMessage` WHERE id = ?', [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({ error: 'Failed to delete contact message' });
  }
});

export default router;
