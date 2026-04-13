import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// ---------------------------------------------------------------------------
// Helper: generate a unique slug from a title
// ---------------------------------------------------------------------------
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

async function uniqueSlug(title) {
  const base = slugify(title);
  let candidate = base;
  let suffix = 2;

  while (await prisma.post.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

async function uniqueSlugForUpdate(title, currentPostId) {
  const base = slugify(title);
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await prisma.post.findUnique({
      where: { slug: candidate },
    });
    if (!existing || existing.id === currentPostId) {
      return candidate;
    }
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

// ---------------------------------------------------------------------------
// GET /api/posts — list with filters + pagination
// ---------------------------------------------------------------------------
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

    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (tag) {
      // MySQL JSON contains — Prisma `path` filtering
      where.tags = { path: '$', array_contains: tag };
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.post.count({ where }),
    ]);

    res.json({
      posts,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    if (
      error.code === 'P1001' ||
      error.message?.includes("Can't reach database")
    ) {
      return res.json({ posts: [], total: 0, page: 1, totalPages: 0 });
    }
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/posts/admin/all — admin list (auth)
// ---------------------------------------------------------------------------
router.get('/admin/all', authMiddleware, async (_req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { publishedAt: 'desc' },
    });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching admin posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/posts/:slug — single post
// ---------------------------------------------------------------------------
router.get('/:slug', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: req.params.slug },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    if (
      error.code === 'P1001' ||
      error.message?.includes("Can't reach database")
    ) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/posts — create (auth)
// ---------------------------------------------------------------------------
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      coverImageUrl,
      tags,
      category,
      authorName,
      isFeatured,
      readingTime,
    } = req.body;

    // Validation
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

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImageUrl: coverImageUrl || null,
        tags: Array.isArray(tags) ? tags : [],
        category,
        authorName,
        isFeatured: Boolean(isFeatured),
        readingTime: parseInt(readingTime, 10) || 5,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// ---------------------------------------------------------------------------
// PUT /api/posts/:id — update (auth)
// ---------------------------------------------------------------------------
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      coverImageUrl,
      tags,
      category,
      authorName,
      isFeatured,
      readingTime,
      publishedAt,
    } = req.body;

    const existing = await prisma.post.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const nextTitle = typeof title === 'string' ? title : existing.title;
    const nextSlug = await uniqueSlugForUpdate(nextTitle, existing.id);

    const updated = await prisma.post.update({
      where: { id: req.params.id },
      data: {
        title: nextTitle,
        slug: nextSlug,
        excerpt: typeof excerpt === 'string' ? excerpt : existing.excerpt,
        content: typeof content === 'string' ? content : existing.content,
        coverImageUrl: coverImageUrl || null,
        tags: Array.isArray(tags) ? tags : existing.tags,
        category: typeof category === 'string' ? category : existing.category,
        authorName:
          typeof authorName === 'string' ? authorName : existing.authorName,
        isFeatured:
          typeof isFeatured === 'boolean' ? isFeatured : existing.isFeatured,
        readingTime: parseInt(readingTime, 10) || existing.readingTime,
        publishedAt: publishedAt ? new Date(publishedAt) : existing.publishedAt,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// ---------------------------------------------------------------------------
// DELETE /api/posts/:id — delete (auth)
// ---------------------------------------------------------------------------
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.post.delete({ where: { id: req.params.id } });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;
