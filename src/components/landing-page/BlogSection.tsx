import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '@/styles/sections/FeaturedBlogSection.css';
import { resolveMediaUrl } from '@/lib/media';
import ScrollTextMarque from '@/components/ui/scroll-text-marque';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

gsap.registerPlugin(ScrollTrigger);

type BlogPost = {
  category: string;
  date: string;
  excerpt: string;
  href: string;
  id: number;
  image: string;
  readingTime: number;
  title: string;
};

type ApiPost = {
  category?: string;
  coverImageUrl?: string | null;
  excerpt?: string;
  id?: number | string;
  publishedAt?: string;
  readingTime?: number;
  slug?: string;
  title?: string;
};

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsListRef = useRef<HTMLDivElement | null>(null);
  const stickyPanelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const mapPost = (post: ApiPost, index: number): BlogPost => ({
      category: post.category ?? 'Updates',
      date: new Date(post.publishedAt ?? Date.now()).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      excerpt: post.excerpt ?? '',
      href: `/blog/${post.slug ?? ''}`,
      id: Number(post.id) || index + 1,
      image: resolveMediaUrl(post.coverImageUrl ?? null, API_URL) || '',
      readingTime: post.readingTime ?? 0,
      title: post.title ?? 'Untitled post',
    });

    const fetchFeaturedPosts = async () => {
      try {
        const [featuredResponse, latestResponse] = await Promise.all([
          fetch(`${API_URL}/api/posts?featured=true&limit=5`),
          fetch(`${API_URL}/api/posts?limit=12`),
        ]);

        if (!featuredResponse.ok || !latestResponse.ok) {
          throw new Error('Failed to fetch blog posts');
        }

        const featuredData = await featuredResponse.json();
        const latestData = await latestResponse.json();
        const featuredPosts = Array.isArray(featuredData.posts)
          ? featuredData.posts
          : [];
        const latestPosts = Array.isArray(latestData.posts)
          ? latestData.posts
          : [];

        const combined = [...featuredPosts];
        const seen = new Set(combined.map((post: ApiPost) => post.id));

        for (const post of latestPosts) {
          if (combined.length >= 5) {
            break;
          }

          if (seen.has(post.id)) {
            continue;
          }

          combined.push(post);
          seen.add(post.id);
        }

        if (!cancelled) {
          setBlogPosts(combined.slice(0, 4).map(mapPost));
        }
      } catch (error) {
        console.error('Error fetching featured posts:', error);
      }
    };

    fetchFeaturedPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    if (!blogPosts.length) {
      return;
    }

    if (
      !sectionRef.current ||
      !stickyPanelRef.current ||
      !cardsListRef.current
    ) {
      return;
    }

    const section = sectionRef.current;
    const stickyPanel = stickyPanelRef.current;
    const cardsList = cardsListRef.current;
    const images = Array.from(cardsList.querySelectorAll('img'));
    const media = window.matchMedia('(min-width: 1100px)');

    const context = gsap.context(() => {
      ScrollTrigger.matchMedia({
        '(min-width: 1100px)': () => {
          const trigger = ScrollTrigger.create({
            end: 'bottom bottom',
            endTrigger: cardsList,
            invalidateOnRefresh: true,
            pin: stickyPanel,
            pinSpacing: false,
            start: 'top top+=32',
            trigger: section,
          });

          return () => {
            trigger.kill();
          };
        },
      });
    }, section);

    const refresh = () => {
      ScrollTrigger.refresh();
    };

    const refreshAfterLayoutSettles = () => {
      window.requestAnimationFrame(refresh);
    };

    images.forEach((image) => {
      if (image.complete) {
        return;
      }

      image.addEventListener('load', refreshAfterLayoutSettles, { once: true });
      image.addEventListener('error', refreshAfterLayoutSettles, {
        once: true,
      });
    });

    window.addEventListener('resize', refresh);
    media.addEventListener('change', refresh);
    refreshAfterLayoutSettles();

    return () => {
      images.forEach((image) => {
        image.removeEventListener('load', refreshAfterLayoutSettles);
        image.removeEventListener('error', refreshAfterLayoutSettles);
      });
      window.removeEventListener('resize', refresh);
      media.removeEventListener('change', refresh);
      context.revert();
    };
  }, [blogPosts.length]);

  if (blogPosts.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id='featured-blogs-section'
      data-scroll
      data-scroll-speed='0'
      className='relative w-full bg-[hsl(var(--brand-cream))] text-[hsl(var(--brand-black-900))]'
    >
      <div className='relative z-[2] overflow-hidden px-0 pb-3 pt-1 md:pb-4 md:pt-2'>
        <ScrollTextMarque
          baseVelocity={-1}
          className='pr-[1.3rem] text-[clamp(3rem,6vw,5.5rem)] font-light italic leading-[0.86] tracking-[-0.08em] text-[hsl(var(--brand-black)/0.52)]'
        >
          we build wealth that lasts
        </ScrollTextMarque>
      </div>

      <div className='container-custom section-padding !pt-12'>
        <div className='grid grid-cols-1 gap-14 lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-16'>
          <aside
            ref={stickyPanelRef}
            className='featured-blog-sticky flex flex-col items-start gap-7'
          >
            <span className='text-sm uppercase tracking-widest text-[hsl(var(--brand-black-900)/0.56)]'>
              Insights and Updates
            </span>
            <h2 className='max-w-none text-[clamp(2rem,4.4vw,4.75rem)] font-light leading-[0.95] tracking-tight text-[hsl(var(--brand-black-900))]'>
              <span className='block whitespace-nowrap'>Fresh ideas</span>
              <span className='block whitespace-nowrap'>from our</span>
              <span className='block whitespace-nowrap'>latest writing.</span>
            </h2>
            <Link
              to='/blog'
              className='inline-flex items-center gap-4 rounded-full border border-[hsl(var(--brand-black-900)/0.35)] px-7 py-4 text-lg text-[hsl(var(--brand-black-900))] transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[hsl(var(--brand-black-900)/0.65)] hover:bg-[hsl(var(--brand-black-900)/0.05)]'
            >
              <span className='h-px w-6 bg-current' />
              <span>View All Posts</span>
            </Link>
          </aside>

          <div ref={cardsListRef} className='featured-blog-list'>
            {blogPosts.map((post) => (
              <Link
                to={post.href}
                key={post.id}
                aria-label={`Read ${post.title}`}
                className='featured-blog-card'
              >
                <div className='featured-blog-image-wrapper'>
                  <img
                    src={post.image}
                    alt={post.title}
                    className='featured-blog-image'
                  />
                </div>

                <div className='featured-blog-overlay' />

                <span className='featured-blog-status'>{post.category}</span>

                <div className='featured-blog-content'>
                  <div className='featured-blog-meta'>
                    <span>{post.date}</span>
                    <span>{post.readingTime} min read</span>
                  </div>
                  <h3 className='featured-blog-title'>{post.title}</h3>
                  <p className='featured-blog-excerpt'>{post.excerpt}</p>
                  <span className='featured-blog-cta'>
                    <span className='featured-blog-cta-text'>
                      <span>Explore article</span>
                      <span>Explore article</span>
                    </span>
                    <span className='featured-blog-cta-arrow'>
                      <span aria-hidden='true'>&#8599;</span>
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
