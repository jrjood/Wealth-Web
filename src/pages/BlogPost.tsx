import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { resolveMediaUrl } from '@/lib/media';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Copy,
  Check,
  BookOpen,
} from 'lucide-react';
import { FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  tags: string[];
  category: string;
  authorName: string;
  publishedAt: string;
  readingTime: number;
}

interface PostsResponse {
  posts: Post[];
  total: number;
}

/* ─── Lightweight Markdown → HTML ─────────────────────────────────── */
function markdownToHtml(md: string): string {
  let html = md
    // Code blocks
    .replace(
      /```(\w*)\n([\s\S]*?)```/g,
      '<pre><code class="language-$1">$2</code></pre>',
    )
    // Tables
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split('|').filter((c) => c.trim());
      const isHeader = cells.every((c) => /^[\s-:]+$/.test(c));
      if (isHeader) return ''; // separator row
      const tag = 'td';
      const row = cells.map((c) => `<${tag}>${c.trim()}</${tag}>`).join('');
      return `<tr>${row}</tr>`;
    })
    // Headings
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold & italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Paragraphs (blank-line separated)
    .replace(/\n\n/g, '</p><p>')
    // Line breaks
    .replace(/\n/g, '<br/>');

  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>.*?<\/li>(<br\/>)?)+/g, (match) => {
    return '<ul>' + match.replace(/<br\/>/g, '') + '</ul>';
  });

  // Wrap table rows
  html = html.replace(/(<tr>.*?<\/tr>(<br\/>)?)+/g, (match) => {
    const rows = match.match(/<tr>.*?<\/tr>/g) || [];
    if (rows.length === 0) return match;
    const headerRow = rows[0]
      .replace(/<td>/g, '<th>')
      .replace(/<\/td>/g, '</th>');
    const bodyRows = rows.slice(1).join('');
    return `<table><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`;
  });

  return `<p>${html}</p>`
    .replace(/<p><\/p>/g, '')
    .replace(/<p><h/g, '<h')
    .replace(/<\/h(\d)><\/p>/g, '</h$1>')
    .replace(/<p><pre>/g, '<pre>')
    .replace(/<\/pre><\/p>/g, '</pre>')
    .replace(/<p><ul>/g, '<ul>')
    .replace(/<\/ul><\/p>/g, '</ul>')
    .replace(/<p><table>/g, '<table>')
    .replace(/<\/table><\/p>/g, '</table>');
}

/* ─── Extract headings for TOC ────────────────────────────────────── */
interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractToc(md: string): TocItem[] {
  const headingRegex = /^(#{2,4}) (.+)$/gm;
  const items: TocItem[] = [];
  let match;
  while ((match = headingRegex.exec(md)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    items.push({ id, text, level });
  }
  return items;
}

/* ─── Inject IDs into rendered HTML headings ──────────────────────── */
function injectHeadingIds(html: string): string {
  return html.replace(/<h([2-4])>(.*?)<\/h\1>/g, (_match, level, text) => {
    const plainText = text.replace(/<[^>]+>/g, '');
    const id = plainText
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    return `<h${level} id="${id}">${text}</h${level}>`;
  });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;

    (async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await fetch(`${API_URL}/api/posts/${slug}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        const data: Post = await res.json();
        setPost(data);

        // Fetch related posts in same category
        const relRes = await fetch(
          `${API_URL}/api/posts?category=${encodeURIComponent(data.category)}&limit=4`,
        );
        const relData: PostsResponse = await relRes.json();
        setRelatedPosts(
          relData.posts.filter((p: Post) => p.slug !== slug).slice(0, 3),
        );
      } catch (err) {
        console.error('Error fetching post:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  // SEO meta
  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} — Wealth Holding Blog`;

    const setMeta = (property: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(
        `meta[property="${property}"]`,
      );
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('og:title', post.title);
    setMeta('og:description', post.excerpt);
    setMeta('og:type', 'article');
    setMeta('og:url', window.location.href);
    if (post.coverImageUrl) {
      setMeta('og:image', resolveMediaUrl(post.coverImageUrl, API_URL));
    }

    return () => {
      document.title = 'Wealth Holding';
    };
  }, [post]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(post?.title || '');

  // ─── Loading State ─────────────────────────────────────────────────
  if (loading) {
    return (
      <Layout>
        <div className='pt-32 pb-20'>
          <div className='container-custom max-w-4xl animate-pulse space-y-6'>
            <div className='h-8 w-32 bg-muted rounded' />
            <div className='aspect-[21/9] bg-muted rounded-xl' />
            <div className='h-10 w-3/4 bg-muted rounded' />
            <div className='flex gap-4'>
              <div className='h-5 w-28 bg-muted rounded' />
              <div className='h-5 w-24 bg-muted rounded' />
            </div>
            <div className='space-y-3'>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className='h-4 bg-muted rounded'
                  style={{ width: `${85 - i * 5}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ─── 404 State ─────────────────────────────────────────────────────
  if (notFound || !post) {
    return (
      <Layout>
        <div className='pt-32 pb-20 text-center'>
          <div className='container-custom'>
            <BookOpen className='w-20 h-20 mx-auto text-muted-foreground/30 mb-6' />
            <h1 className='text-3xl font-bold text-foreground mb-4'>
              Post Not Found
            </h1>
            <p className='text-muted-foreground mb-8'>
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild variant='outline'>
              <Link to='/blog'>
                <ArrowLeft className='w-4 h-4 mr-2' /> Back to Blog
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const toc = extractToc(post.content);
  const contentHtml = injectHeadingIds(markdownToHtml(post.content));
  const parsedTags = Array.isArray(post.tags) ? post.tags : [];

  return (
    <Layout>
      <section className='relative isolate flex min-h-[100svh] items-end overflow-hidden bg-[hsl(var(--brand-black))]'>
        {post.coverImageUrl ? (
          <img
            src={resolveMediaUrl(post.coverImageUrl, API_URL)}
            alt={post.title}
            className='absolute inset-0 h-full w-full object-cover'
          />
        ) : null}
        <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.34)_26%,rgba(0,0,0,0.6)_64%,rgba(0,0,0,0.92)_100%)]' />

        <div className='container-custom relative z-10 w-full max-w-6xl pb-12 pt-28 sm:pb-14 sm:pt-32 lg:pb-16'>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Button
              asChild
              variant='ghost'
              size='sm'
              className='mb-8 border border-white/14 bg-black/20 text-white backdrop-blur-sm hover:border-white/24 hover:bg-black/32 hover:text-white'
            >
              <Link to='/blog'>
                <ArrowLeft className='mr-2 h-4 w-4' /> Back to Blog
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='max-w-4xl'
          >
            <div className='mb-4 flex flex-wrap gap-2'>
              <span className='rounded-full border border-white/18 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm'>
                {post.category}
              </span>
              {parsedTags.map((tag) => (
                <span
                  key={tag}
                  className='rounded-full border border-white/12 bg-black/18 px-3 py-1 text-xs font-medium text-white/82 backdrop-blur-sm'
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className='mb-6 max-w-5xl text-4xl font-bold leading-[0.96] text-white sm:text-5xl lg:text-6xl'>
              {post.title}
            </h1>

            <div className='flex flex-wrap items-center gap-4 border-b border-white/14 pb-2 text-sm text-white/82'>
              <span className='flex items-center gap-1.5'>
                <User className='h-4 w-4' />
                {post.authorName}
              </span>
              <span className='flex items-center gap-1.5'>
                <Calendar className='h-4 w-4' />
                {formatDate(post.publishedAt)}
              </span>
              <span className='flex items-center gap-1.5'>
                <Clock className='h-4 w-4' />
                {post.readingTime} min read
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className='container-custom relative z-10 max-w-6xl pb-20 pt-12 sm:pt-14 lg:pt-16'>
        <div className='flex gap-12'>
          {/* ─── TOC Sidebar (desktop) ───────────────────────────── */}
          {toc.length > 0 && (
            <aside className='hidden xl:block w-56 flex-shrink-0'>
              <div className='sticky top-28'>
                <p className='text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4'>
                  Table of Contents
                </p>
                <nav className='space-y-1.5 border-l border-border pl-4'>
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-sm text-muted-foreground hover:text-foreground transition-colors leading-snug ${
                        item.level === 3 ? 'pl-3 text-xs' : ''
                      } ${item.level === 4 ? 'pl-6 text-xs' : ''}`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* ─── Main Content ────────────────────────────────────── */}
          <article className='flex-1 min-w-0'>
            {/* Article body */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='prose prose-neutral dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:leading-relaxed prose-p:text-foreground/80
                prose-li:text-foreground/80
                prose-strong:text-foreground
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-[#0d0d0d] prose-pre:border prose-pre:border-border prose-pre:rounded-xl
                prose-table:border-collapse
                prose-th:border prose-th:border-border prose-th:px-4 prose-th:py-2 prose-th:bg-muted
                prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2'
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {/* Share buttons */}
            <div className='mt-12 pt-8 border-t border-border'>
              <div className='flex flex-wrap items-center gap-3'>
                <span className='text-sm font-medium text-muted-foreground flex items-center gap-1.5'>
                  <Share2 className='w-4 h-4' /> Share
                </span>
                <a
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all'
                  aria-label='Share on Twitter'
                >
                  <FaTwitter className='w-4 h-4' />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all'
                  aria-label='Share on LinkedIn'
                >
                  <FaLinkedinIn className='w-4 h-4' />
                </a>
                <button
                  onClick={handleCopyLink}
                  className='w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all'
                  aria-label='Copy link'
                >
                  {copied ? (
                    <Check className='w-4 h-4 text-green-500' />
                  ) : (
                    <Copy className='w-4 h-4' />
                  )}
                </button>
              </div>
            </div>
          </article>
        </div>

        {/* ─── Related Posts ───────────────────────────────────── */}
        {relatedPosts.length > 0 && (
          <section className='mt-20 pt-12 border-t border-border'>
            <h2 className='heading-section text-foreground mb-8'>
              Related Articles
            </h2>
            <div className='grid md:grid-cols-3 gap-8'>
              {relatedPosts.map((rp, index) => (
                <motion.div
                  key={rp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    to={`/blog/${rp.slug}`}
                    className='group block rounded-xl overflow-hidden bg-card border border-border hover:border-primary/20 transition-all card-elevated'
                  >
                    <div className='aspect-[16/10] overflow-hidden bg-muted'>
                      {rp.coverImageUrl ? (
                        <img
                          src={resolveMediaUrl(rp.coverImageUrl, API_URL)}
                          alt={rp.title}
                          className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                          loading='lazy'
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center text-muted-foreground'>
                          <BookOpen className='w-10 h-10 opacity-30' />
                        </div>
                      )}
                    </div>
                    <div className='p-5'>
                      <span className='text-[11px] font-semibold text-primary tracking-wide'>
                        {rp.category}
                      </span>
                      <h3 className='text-base font-bold text-foreground mt-1 mb-1 line-clamp-2 group-hover:text-primary transition-colors'>
                        {rp.title}
                      </h3>
                      <p className='text-xs text-muted-foreground'>
                        {rp.readingTime} min read
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default BlogPost;
