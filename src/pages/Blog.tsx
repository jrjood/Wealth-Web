import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Search, Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { resolveMediaUrl } from '@/lib/media';
import { useSEO } from '@/hooks/useSEO';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
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
  page: number;
  totalPages: number;
}

// Skeleton card for loading state
const SkeletonCard = () => (
  <div className='rounded-xl overflow-hidden bg-card border border-border animate-pulse'>
    <div className='aspect-[16/10] bg-muted' />
    <div className='p-6 space-y-3'>
      <div className='flex gap-2'>
        <div className='h-5 w-20 bg-muted rounded-full' />
        <div className='h-5 w-16 bg-muted rounded-full' />
      </div>
      <div className='h-6 w-3/4 bg-muted rounded' />
      <div className='space-y-2'>
        <div className='h-4 w-full bg-muted rounded' />
        <div className='h-4 w-2/3 bg-muted rounded' />
      </div>
      <div className='flex items-center gap-4 pt-2'>
        <div className='h-4 w-24 bg-muted rounded' />
        <div className='h-4 w-20 bg-muted rounded' />
      </div>
    </div>
  </div>
);

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const fetchPosts = useCallback(
    async (p: number, search: string, category: string, append: boolean) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(p), limit: '9' });
        if (search) params.set('search', search);
        if (category && category !== 'All') params.set('category', category);

        const res = await fetch(`${API_URL}/api/posts?${params}`);
        const data: PostsResponse = await res.json();

        setPosts((prev) => (append ? [...prev, ...data.posts] : data.posts));
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    setPage(1);
    fetchPosts(1, debouncedSearch, activeCategory, false);
  }, [debouncedSearch, activeCategory, fetchPosts]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchPosts(next, debouncedSearch, activeCategory, true);
  };

  // Extract unique categories from fetched posts + known ones
  const categories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category));
    return ['All', ...Array.from(cats).sort()];
  }, [posts]);

  // SEO
  useSEO({
    title: 'Blog — Wealth Holding',
    description: 'Expert insights on luxury real estate, market trends, design inspiration, and investment strategies.'
  });

  return (
    <Layout>
      {/* Hero */}
      <section className='relative bg-[#060606] pt-32 pb-20 overflow-hidden'>
        {/* Subtle gradient overlay */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-brand-gold/5' />
        <div className='container-custom relative z-10'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center max-w-3xl mx-auto'
          >
            <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/60 text-xs font-medium tracking-wider uppercase mb-6'>
              <BookOpen className='w-3.5 h-3.5' />
              Insights & Updates
            </div>
            <h1 className='heading-display text-white mb-6'>Our Blog</h1>
            <p className='text-body-lg text-white/60 max-w-xl mx-auto'>
              Expert insights on luxury real estate, market trends, design
              inspiration, and investment strategies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className='sticky top-0 z-40 border-b border-border bg-card py-8'>
        <div className='container-custom'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
            {/* Search */}
            <div className='relative w-full sm:w-72'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
              <input
                type='text'
                placeholder='Search articles...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all'
              />
            </div>

            {/* Category pills */}
            <div className='flex flex-wrap gap-2'>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  type='button'
                  onClick={() => setActiveCategory(cat)}
                  variant={activeCategory === cat ? 'default' : 'outline'}
                  size='sm'
                  className={`normal-case tracking-normal text-base md:text-sm ${
                    activeCategory === cat
                      ? 'border-transparent'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className='section-padding bg-background'>
        <div className='container-custom'>
          {/* Loading skeletons */}
          {loading && posts.length === 0 && (
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Posts */}
          {posts.length > 0 && (
            <>
              <motion.div
                layout
                className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'
              >
                <AnimatePresence mode='popLayout'>
                  {posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Link
                        to={`/blog/${post.slug}`}
                        className='group block rounded-xl overflow-hidden bg-card border border-border hover:border-primary/20 transition-all duration-300 card-elevated'
                      >
                        {/* Image */}
                        <div className='aspect-[16/10] overflow-hidden bg-muted'>
                          {post.coverImageUrl ? (
                            <img
                              src={resolveMediaUrl(post.coverImageUrl, API_URL)}
                              alt={post.title}
                              className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                              loading='lazy'
                            />
                          ) : (
                            <div className='w-full h-full flex items-center justify-center text-muted-foreground'>
                              <BookOpen className='w-12 h-12 opacity-30' />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className='p-6'>
                          {/* Tags */}
                          <div className='flex flex-wrap gap-2 mb-3'>
                            <span className='px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold tracking-wide'>
                              {post.category}
                            </span>
                            {(Array.isArray(post.tags) ? post.tags : [])
                              .slice(0, 2)
                              .map((tag) => (
                                <span
                                  key={tag}
                                  className='px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[11px] font-medium'
                                >
                                  {tag}
                                </span>
                              ))}
                          </div>

                          <h3 className='text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors'>
                            {post.title}
                          </h3>

                          <p className='text-sm text-muted-foreground line-clamp-2 mb-4'>
                            {post.excerpt}
                          </p>

                          {/* Meta */}
                          <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                            <span className='flex items-center gap-1'>
                              <Calendar className='w-3.5 h-3.5' />
                              {formatDate(post.publishedAt)}
                            </span>
                            <span className='flex items-center gap-1'>
                              <Clock className='w-3.5 h-3.5' />
                              {post.readingTime} min read
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Load more */}
              {page < totalPages && (
                <div className='mt-12 text-center'>
                  <Button
                    variant='outline'
                    size='lg'
                    onClick={handleLoadMore}
                    disabled={loading}
                    className='min-w-[200px]'
                  >
                    {loading ? 'Loading...' : 'Load More Articles'}
                    {!loading && <ArrowRight className='w-4 h-4 ml-2' />}
                  </Button>
                </div>
              )}

              {/* Results count */}
              <p className='text-center text-sm text-muted-foreground mt-6'>
                Showing {posts.length} of {total} articles
              </p>
            </>
          )}

          {/* Empty state */}
          {!loading && posts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-center py-20'
            >
              <BookOpen className='w-16 h-16 mx-auto text-muted-foreground/30 mb-4' />
              <h3 className='text-xl font-semibold text-foreground mb-2'>
                No articles found
              </h3>
              <p className='text-muted-foreground mb-6'>
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different search term.`
                  : 'No blog posts available yet. Check back soon!'}
              </p>
              {(searchQuery || activeCategory !== 'All') && (
                <Button
                  variant='outline'
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
