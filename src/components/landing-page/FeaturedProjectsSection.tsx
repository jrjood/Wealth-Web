import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '@/styles/sections/FeaturedProjectsSection.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

type FeaturedProject = {
  id: string;
  image: string;
  location: string;
  status: string;
  title: string;
  type: string;
};

const fallbackFeaturedProjects: FeaturedProject[] = [
  {
    id: '01',
    image:
      'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1600&auto=format&fit=crop',
    location: 'Downtown Dubai, UAE',
    status: 'Selling Now',
    title: 'The Sky Penthouses',
    type: 'Luxury Residential',
  },
  {
    id: '02',
    image:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1600&auto=format&fit=crop',
    location: 'New Cairo, Egypt',
    status: 'Under Construction',
    title: 'East Subah Al-Ahmed City',
    type: 'Mixed-Use Development',
  },
  {
    id: '03',
    image:
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop',
    location: 'Palm Jumeirah, UAE',
    status: 'Signature Collection',
    title: 'Azure Crest Residences',
    type: 'Waterfront Villas',
  },
  {
    id: '04',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop',
    location: 'Riyadh, Saudi Arabia',
    status: 'Limited Release',
    title: 'Noura Gardens',
    type: 'Premium Lifestyle Community',
  },
];

const FeaturedProjectsSection = () => {
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>(
    fallbackFeaturedProjects,
  );

  useEffect(() => {
    let cancelled = false;

    const fetchFeaturedProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/api/projects?featured=true`);
        const data = await response.json();

        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setFeaturedProjects(
            data.slice(0, 4).map((project: any, index: number) => ({
              id: project.id,
              image:
                project.imageUrl ||
                fallbackFeaturedProjects[
                  index % fallbackFeaturedProjects.length
                ].image,
              location: project.location,
              status: project.status,
              title: project.title,
              type: project.type,
            })),
          );
        }
      } catch (error) {
        console.error('Error fetching featured projects:', error);
      }
    };

    fetchFeaturedProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id='featured-projects-section'
      data-scroll
      data-scroll-speed='0'
      className='relative w-screen bg-brand-cream text-brand-black'
    >
      <div className='container-custom section-padding'>
        <div className='grid grid-cols-1 gap-14 lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-16'>
          <aside className='featured-projects-sticky flex flex-col items-start gap-7'>
            <span className='text-sm uppercase tracking-widest text-brand-black/55'>
              Other Featured Projects
            </span>
            <h2 className='max-w-[9ch] text-5xl font-light leading-none tracking-tight md:text-6xl lg:text-7xl'>
              Making the world a
              <br />
              more beautiful place.
            </h2>
            <Link
              to='/projects'
              className='inline-flex items-center gap-4 rounded-full border border-brand-black/40 px-7 py-4 text-lg transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand-black hover:bg-brand-black/5'
            >
              <span className='h-px w-6 bg-current' />
              <span>View All Projects</span>
            </Link>
          </aside>

          <div className='featured-projects-list'>
            {featuredProjects.map((project) => (
              <Link
                to={`/projects/${project.id}`}
                key={project.id}
                aria-label={`Explore ${project.title}`}
                className='featured-project-card'
              >
                <div className='featured-project-image-wrapper'>
                  <img
                    src={project.image}
                    alt={project.title}
                    className='featured-project-image'
                  />
                </div>

                <div className='featured-project-overlay' />

                <span className='featured-project-status'>
                  {project.status}
                </span>

                <div className='featured-project-content'>
                  <div className='featured-project-meta'>
                    <span>{project.location}</span>
                    <span>{project.type}</span>
                  </div>
                  <h3 className='featured-project-title'>{project.title}</h3>
                  <span className='featured-project-cta'>
                    <span className='featured-project-cta-text'>
                      <span>Explore project</span>
                      <span>Explore project</span>
                    </span>
                    <span className='featured-project-cta-arrow'>
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

export default FeaturedProjectsSection;
