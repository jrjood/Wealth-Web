import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

const fallbackBlogPosts: BlogPost[] = [
  {
    category: 'Announcements',
    date: 'Apr 07, 2025',
    excerpt:
      'Discover how blockchain technology is revolutionizing the real estate industry with digital twins and smart contracts.',
    href: '#',
    id: 1,
    image:
      'https://thisismagma.com/wp-content/uploads/2025/04/thisismagma.com-rewriting-real-estate-zoniqx-and-magma-power-the-new-digital-asset-frontier-magma-zoniqx-partnership-scaled.jpg',
    readingTime: 5,
    title:
      'Rewriting Real Estate: The Future of Digital Real Estate Development',
  },
  {
    category: 'Technology',
    date: 'Jan 30, 2025',
    excerpt:
      'Experience immersive 3D property visualization powered by cutting-edge blockchain technology.',
    href: '#',
    id: 2,
    image:
      'https://thisismagma.com/wp-content/uploads/2025/01/thisismagma.com-digital-twins-meet-blockchain-magmas-3d-viewer-is-live-screenshot-2025-01-30-at-08.32.08.png',
    readingTime: 4,
    title: 'Digital Innovation: Advanced 3D Property Visualization',
  },
  {
    category: 'Events',
    date: 'Jan 27, 2025',
    excerpt:
      'Connect with industry leaders and explore the future of digital real estate.',
    href: '#',
    id: 3,
    image:
      'https://thisismagma.com/wp-content/uploads/2025/01/thisismagma.com-join-us-at-the-miami-digital-real-estate-summit-miami-digital-real-estate-summit.jpg',
    readingTime: 3,
    title: 'Join Us at the Miami Digital Real Estate Summit',
  },
  {
    category: 'Insights',
    date: 'Dec 15, 2024',
    excerpt: 'Exploring next-generation development tools and frameworks.',
    href: '#',
    id: 4,
    image:
      'https://thisismagma.com/wp-content/uploads/2024/12/thisismagma.com-magma-x-webflow-build-better-faster-featured-1.jpg',
    readingTime: 6,
    title: 'The Future of Real Estate Development',
  },
  {
    category: 'Innovation',
    date: 'Nov 22, 2024',
    excerpt: 'How modern technology is shaping the infrastructure of tomorrow.',
    href: '#',
    id: 5,
    image:
      'https://thisismagma.com/wp-content/uploads/2024/11/featured-image.jpg',
    readingTime: 4,
    title: "Building Tomorrow's Digital Infrastructure",
  },
  {
    category: 'Market Insights',
    date: 'Oct 03, 2024',
    excerpt:
      'A practical guide for evaluating high-growth opportunities in premium real estate sectors.',
    href: '#',
    id: 6,
    image:
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1800&auto=format&fit=crop',
    readingTime: 5,
    title: 'How to Evaluate High-Value Real Estate Opportunities',
  },
];

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(fallbackBlogPosts);

  useEffect(() => {
    let cancelled = false;

    const mapPost = (post: any, index: number): BlogPost => ({
      category: post.category,
      date: new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      excerpt: post.excerpt,
      href: `/blog/${post.slug}`,
      id: Number(post.id) || index + 1,
      image: post.coverImageUrl || fallbackBlogPosts[0].image,
      readingTime: post.readingTime,
      title: post.title,
    });

    const fetchFeaturedPosts = async () => {
      try {
        const [featuredResponse, latestResponse] = await Promise.all([
          fetch(`${API_URL}/api/posts?featured=true&limit=5`),
          fetch(`${API_URL}/api/posts?limit=12`),
        ]);

        const featuredData = await featuredResponse.json();
        const latestData = await latestResponse.json();
        const featuredPosts = Array.isArray(featuredData.posts)
          ? featuredData.posts
          : [];
        const latestPosts = Array.isArray(latestData.posts)
          ? latestData.posts
          : [];

        const combined = [...featuredPosts];
        const seen = new Set(combined.map((post: any) => post.id));

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

        if (!cancelled && combined.length > 0) {
          setBlogPosts(combined.slice(0, 5).map(mapPost));
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

  return (
    <section
      id='page11'
      data-scroll
      data-scroll-speed='0'
      className='relative flex min-h-screen w-screen flex-col gap-6 bg-[hsl(var(--brand-black-800))] px-[1.2rem] py-[5.5rem] text-white md:gap-10 md:px-[9.38%] md:py-[8rem]'
    >
      <div className='mx-auto w-full max-w-[90rem]'>
        <div className='mb-8 flex w-full flex-col items-start gap-4 md:mb-8 md:items-end md:justify-between'>
          <div className='flex w-full flex-col items-start gap-2'>
            <p className='m-0 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[hsl(var(--brand-red-100))] md:text-[0.75rem] md:tracking-[0.24em]'>
              INSIGHTS &amp; UPDATES
            </p>
            <div className='flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
              <h1 className='animateHeading_page11 text-[clamp(2rem,6.2vw,6rem)] font-normal leading-[1.08]'>
                From the Blog
              </h1>
              <Link
                to='/blog'
                aria-label='View all blog posts'
                className='inline-flex items-center gap-[0.55rem] text-base font-normal transition-colors duration-300 hover:text-[hsl(var(--brand-red-500))] md:-translate-y-[0.35rem] md:text-[1.15rem]'
              >
                <span>View all posts</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  width='16'
                  height='16'
                  fill='currentColor'
                  aria-hidden='true'
                  className='transition-transform duration-300 hover:translate-x-1'
                >
                  <path d='M12.586 12 8.293 7.707 9.707 6.293 15.414 12 9.707 17.707 8.293 16.293z'></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-[clamp(0.75rem,1.2vw,1.1rem)]'>
          {blogPosts.map((post, index) => {
            const isHero = index === 0;

            return (
              <div key={post.id} className={isHero ? 'md:col-span-2' : ''}>
                <a href={post.href} className='group block h-full'>
                  <div
                    className={`relative h-full min-h-[260px] overflow-hidden bg-black ${
                      isHero ? 'md:min-h-[440px] lg:min-h-[520px]' : ''
                    }`}
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className='absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.08]'
                    />
                    <div className='absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.5)_40%,rgba(0,0,0,0.1)_70%,transparent_100%)]' />

                    <div className='absolute left-[0.9rem] top-[0.9rem] z-[3] md:left-6 md:top-6'>
                      <span className='inline-block rounded-[25px] border border-[rgba(204,0,10,0.3)] bg-[rgba(0,0,0,0.4)] px-[0.7rem] py-[0.35rem] text-[0.6rem] font-semibold uppercase tracking-[1.2px] text-white backdrop-blur-[10px] md:px-4 md:py-2 md:text-[0.7vw]'>
                        {post.category}
                      </span>
                    </div>

                    <div className='absolute inset-x-0 bottom-0 z-[2] p-[1.1rem] md:px-8 md:pb-8 md:pt-7'>
                      <h3
                        className={`mb-3 font-semibold leading-[1.25] text-white transition-[text-shadow] duration-300 group-hover:[text-shadow:0_0_16px_hsl(var(--brand-red-100)_/_0.9)] ${
                          isHero
                            ? 'text-[1.35rem] md:text-[1.8vw]'
                            : 'text-[1.05rem] md:text-[1.1vw]'
                        }`}
                      >
                        {post.title}
                      </h3>

                      {isHero ? (
                        <p className='mb-4 max-w-full text-[0.82rem] leading-[1.5] text-white/70 md:max-w-[85%] md:text-[0.9vw]'>
                          {post.excerpt}
                        </p>
                      ) : null}

                      <div className='flex items-center gap-3 text-[0.7rem] font-medium text-white/60 md:gap-4 md:text-[0.7vw]'>
                        <span className='flex items-center gap-[0.3rem]'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 24 24'
                            width='12'
                            height='12'
                            fill='currentColor'
                          >
                            <path d='M17 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9V3H15V1H17V3ZM4 9V19H20V9H4ZM6 11H8V13H6V11ZM11 11H13V13H11V11ZM16 11H18V13H16V11Z'></path>
                          </svg>
                          {post.date}
                        </span>
                        <span className='flex items-center gap-[0.3rem]'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 24 24'
                            width='12'
                            height='12'
                            fill='currentColor'
                          >
                            <path d='M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM13 12V7H11V14H17V12H13Z'></path>
                          </svg>
                          {post.readingTime} min
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
