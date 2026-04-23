import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { query } from '../lib/db.js';
import {
  createImageUpload,
  deleteUploadedImage,
  toPublicUploadUrl,
} from '../lib/imageUpload.js';

const router = express.Router();
const { upload: postCoverUpload } = createImageUpload('posts');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

const toBoolean = (value) => value === 1 || value === true || value === '1';

const parseBoolean = (value) =>
  value === true || value === 1 || value === '1' || value === 'true';

const normalizeString = (value) =>
  typeof value === 'string' ? value.trim() : '';

const parseTags = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const mapPost = (post) => ({
  ...post,
  tags: parseTags(post.tags),
  isFeatured: toBoolean(post.isFeatured),
});

const resolveCoverImageUrl = ({
  file,
  coverImageUrl,
  existingCoverImageUrl,
}) => {
  if (file) {
    return toPublicUploadUrl('posts', file.filename);
  }

  const directCoverImageUrl = normalizeString(coverImageUrl);
  if (directCoverImageUrl) {
    return directCoverImageUrl;
  }

  const fallbackCoverImageUrl = normalizeString(existingCoverImageUrl);
  return fallbackCoverImageUrl || null;
};

async function uniqueSlug(title) {
  const base = slugify(title);
  let candidate = base;
  let suffix = 2;

  while (true) {
    const rows = await query('SELECT id FROM `Post` WHERE slug = ? LIMIT 1', [
      candidate,
    ]);
    if (rows.length === 0) {
      return candidate;
    }
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

async function uniqueSlugForUpdate(title, currentPostId) {
  const base = slugify(title);
  let candidate = base;
  let suffix = 2;

  while (true) {
    const rows = await query('SELECT id FROM `Post` WHERE slug = ? LIMIT 1', [
      candidate,
    ]);

    if (rows.length === 0 || rows[0].id === currentPostId) {
      return candidate;
    }

    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

function buildWhere({ search = '', category = '', tag = '', featured = '' }) {
  const clauses = [];
  const params = [];

  if (search) {
    clauses.push('(title LIKE ? OR excerpt LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }

  if (category) {
    clauses.push('category = ?');
    params.push(category);
  }

  if (tag) {
    clauses.push("JSON_CONTAINS(tags, JSON_QUOTE(?), '$')");
    params.push(tag);
  }

  if (featured === 'true') {
    clauses.push('isFeatured = 1');
  }

  return {
    whereSql: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '',
    params,
  };
}

router.get('/', async (req, res) => {
  try {
    const {
      search = '',
      category = '',
      tag = '',
      featured = '',
      page = '1',
      limit = '9',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 9));
    const skip = (pageNum - 1) * limitNum;

    const { whereSql, params } = buildWhere({
      search,
      category,
      tag,
      featured,
    });

    const [posts, totalRows] = await Promise.all([
      query(
        `SELECT id, title, slug, excerpt, content, coverImageUrl, tags, category, authorName, publishedAt, isFeatured, readingTime, createdAt, updatedAt FROM \`Post\` ${whereSql} ORDER BY publishedAt DESC LIMIT ${limitNum} OFFSET ${skip}`,
        params,
      ),
      query(`SELECT COUNT(*) AS total FROM \`Post\` ${whereSql}`, params),
    ]);

    const total = totalRows[0]?.total || 0;

    res.json({
      posts: posts.map(mapPost),
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    if (error.message?.includes('Database not configured')) {
      return res.json({ posts: [], total: 0, page: 1, totalPages: 0 });
    }
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.get('/admin/all', authMiddleware, async (_req, res) => {
  try {
    const posts = await query(
      'SELECT id, title, slug, excerpt, content, coverImageUrl, tags, category, authorName, publishedAt, isFeatured, readingTime, createdAt, updatedAt FROM `Post` ORDER BY publishedAt DESC',
    );

    res.json(posts.map(mapPost));
  } catch (error) {
    console.error('Error fetching admin posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const rows = await query(
      'SELECT id, title, slug, excerpt, content, coverImageUrl, tags, category, authorName, publishedAt, isFeatured, readingTime, createdAt, updatedAt FROM \`Post\` WHERE slug = ? LIMIT 1',
      [req.params.slug],
    );

    const post = rows[0];

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(mapPost(post));
  } catch (error) {
    console.error('Error fetching post:', error);
    if (error.message?.includes('Database not configured')) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

router.post('/', authMiddleware, (req, res) => {
  postCoverUpload.single('coverImage')(req, res, async (error) => {
    if (error) {
      return res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : 'Unable to process uploaded image',
      });
    }

    try {
      const {
        title,
        excerpt,
        content,
        coverImageUrl,
        existingCoverImageUrl,
        tags,
        category,
        authorName,
        isFeatured,
        readingTime,
      } = req.body;

      const errors = [];
      if (!title || typeof title !== 'string') errors.push('title');
      if (!excerpt || typeof excerpt !== 'string') errors.push('excerpt');
      if (!content || typeof content !== 'string') errors.push('content');
      if (!category || typeof category !== 'string') errors.push('category');
      if (!authorName || typeof authorName !== 'string')
        errors.push('authorName');

      if (errors.length > 0) {
        return res.status(400).json({
          error: 'Missing or invalid fields',
          fields: errors,
        });
      }

      const slug = await uniqueSlug(title);
      const tagValue = JSON.stringify(parseTags(tags));
      const nextCoverImageUrl = resolveCoverImageUrl({
        file: req.file,
        coverImageUrl,
        existingCoverImageUrl,
      });

      const id = `pst_${Date.now()}`;
      await query(
        'INSERT INTO `Post` (id, title, slug, excerpt, content, coverImageUrl, tags, category, authorName, publishedAt, isFeatured, readingTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          id,
          title,
          slug,
          excerpt,
          content,
          nextCoverImageUrl,
          tagValue,
          category,
          authorName,
          new Date(),
          parseBoolean(isFeatured) ? 1 : 0,
          parseInt(readingTime, 10) || 5,
        ],
      );

      const rows = await query(
        'SELECT id, title, slug, excerpt, content, coverImageUrl, tags, category, authorName, publishedAt, isFeatured, readingTime, createdAt, updatedAt FROM \`Post\` WHERE id = ? LIMIT 1',
        [id],
      );

      res.status(201).json(mapPost(rows[0]));
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  });
});

router.put('/:id', authMiddleware, (req, res) => {
  postCoverUpload.single('coverImage')(req, res, async (error) => {
    if (error) {
      return res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : 'Unable to process uploaded image',
      });
    }

    try {
      const {
        title,
        excerpt,
        content,
        coverImageUrl,
        existingCoverImageUrl,
        tags,
        category,
        authorName,
        isFeatured,
        readingTime,
        publishedAt,
      } = req.body;

      const existingRows = await query(
        'SELECT id, title, excerpt, content, coverImageUrl, tags, category, authorName, publishedAt, isFeatured, readingTime FROM \`Post\` WHERE id = ? LIMIT 1',
        [req.params.id],
      );

      const existing = existingRows[0];
      if (!existing) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const nextTitle = typeof title === 'string' ? title : existing.title;
      const nextSlug = await uniqueSlugForUpdate(nextTitle, existing.id);
      const nextCoverImageUrl = resolveCoverImageUrl({
        file: req.file,
        coverImageUrl,
        existingCoverImageUrl,
      });
      const nextTags = parseTags(tags);

      await query(
        'UPDATE \`Post\` SET title = ?, slug = ?, excerpt = ?, content = ?, coverImageUrl = ?, tags = ?, category = ?, authorName = ?, isFeatured = ?, readingTime = ?, publishedAt = ? WHERE id = ?',
        [
          nextTitle,
          nextSlug,
          typeof excerpt === 'string' ? excerpt : existing.excerpt,
          typeof content === 'string' ? content : existing.content,
          nextCoverImageUrl ?? existing.coverImageUrl ?? null,
          JSON.stringify(
            nextTags.length > 0 ? nextTags : parseTags(existing.tags),
          ),
          typeof category === 'string' ? category : existing.category,
          typeof authorName === 'string' ? authorName : existing.authorName,
          parseBoolean(isFeatured) ? 1 : 0,
          parseInt(readingTime, 10) || existing.readingTime,
          publishedAt ? new Date(publishedAt) : existing.publishedAt,
          req.params.id,
        ],
      );

      const rows = await query(
        'SELECT id, title, slug, excerpt, content, coverImageUrl, tags, category, authorName, publishedAt, isFeatured, readingTime, createdAt, updatedAt FROM \`Post\` WHERE id = ? LIMIT 1',
        [req.params.id],
      );

      const updatedPost = rows[0];
      if (
        req.file &&
        existing.coverImageUrl &&
        existing.coverImageUrl !== updatedPost.coverImageUrl
      ) {
        await deleteUploadedImage(existing.coverImageUrl);
      }

      res.json(mapPost(updatedPost));
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ error: 'Failed to update post' });
    }
  });
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const existingRows = await query(
      'SELECT coverImageUrl FROM `Post` WHERE id = ? LIMIT 1',
      [req.params.id],
    );

    const result = await query('DELETE FROM \`Post\` WHERE id = ?', [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await deleteUploadedImage(existingRows[0]?.coverImageUrl);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;
