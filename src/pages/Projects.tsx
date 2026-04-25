import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { MapPin, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { resolveMediaUrl } from '@/lib/media';
import ParaEffect from '@/components/landing-page/ParaEffect';
import { useSEO } from '@/hooks/useSEO';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Project {
  id: string;
  title: string;
  location: string;
  type: string;
  status: string;
  description: string;
  imageUrl: string | null;
  featured: boolean;
}

const types = ['All', 'Residential', 'Luxury Residential', 'Commercial'];
const statuses = ['All', 'Completed', 'Selling Now', 'Under Construction'];

const Projects = () => {
  useSEO({
    title: 'Our Projects | Wealth Holding',
    description: 'Explore our portfolio of iconic developments that define luxury living and commercial excellence in Egypt.'
  });
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects`);
      const data = await response.json();
      setAllProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = allProjects.filter((project) => {
    const typeMatch = typeFilter === 'All' || project.type === typeFilter;
    const statusMatch =
      statusFilter === 'All' || project.status === statusFilter;
    return typeMatch && statusMatch;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className='bg-muted pt-32 pb-20'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center max-w-3xl mx-auto'
          >
            <h1 className='heading-display text-foreground mb-6'>
              Our Projects
            </h1>
            <p className='text-body-lg text-foreground/70'>
              Explore our portfolio of iconic developments that define luxury
              living and commercial excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className='py-8 bg-card border-b border-border sticky top-0 z-40'>
        <div className='container-custom'>
          <div className='flex flex-wrap items-center gap-4'>
            <div className='flex items-center gap-2 text-muted-foreground'>
              <Filter className='w-5 h-5' />
              <span className='font-medium'>Filters:</span>
            </div>

            {/* Type Filter */}
            <div className='flex flex-wrap gap-2'>
              {types.map((type) => (
                <Button
                  key={type}
                  variant={typeFilter === type ? 'default' : 'outline'}
                  size='sm'
                  className='text-base md:text-sm'
                  onClick={() => setTypeFilter(type)}
                >
                  {type}
                </Button>
              ))}
            </div>

            <div className='w-px h-6 bg-border hidden sm:block' />

            {/* Status Filter */}
            <div className='flex flex-wrap gap-2'>
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'gold' : 'ghost'}
                  size='sm'
                  className='text-base md:text-sm'
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className='section-padding bg-[hsl(var(--brand-black-800))]'>
        <div className='container-custom'>
          {loading ? (
            <div className='text-center py-20'>
              <p className='text-muted-foreground text-lg'>
                Loading projects...
              </p>
            </div>
          ) : (
            <motion.div
              layout
              className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className='group'
                >
                  <Link to={`/projects/${project.id}`}>
                    <div className='relative overflow-hidden rounded-sm card-elevated'>
                      <div className='aspect-[4/3] overflow-hidden'>
                        <img
                          src={
                            resolveMediaUrl(project.imageUrl, API_URL) ||
                            undefined
                          }
                          alt={project.title}
                          className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                        />
                      </div>

                      {/* Status Badge */}
                      <div className='absolute top-4 left-4'>
                        <span className='px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold tracking-wide rounded-full'>
                          {project.status}
                        </span>
                      </div>

                      {/* Type Badge */}
                      <div className='absolute top-4 right-4'>
                        <span className='px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold tracking-wide rounded-full'>
                          {project.type}
                        </span>
                      </div>
                    </div>

                    <div className='mt-4'>
                      <h3 className='font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors'>
                        {project.title}
                      </h3>
                      <div className='flex items-center gap-2 text-muted-foreground text-sm mb-2'>
                        <MapPin className='w-4 h-4' />
                        <span>{project.location}</span>
                      </div>
                      <p className='text-muted-foreground text-sm line-clamp-2'>
                        {project.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-center py-20'
            >
              <p className='text-muted-foreground text-lg'>
                No projects match your current filters.
              </p>
              <Button
                variant='outline'
                className='mt-4'
                onClick={() => {
                  setTypeFilter('All');
                  setStatusFilter('All');
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      <ParaEffect />
    </Layout>
  );
};

export default Projects;
