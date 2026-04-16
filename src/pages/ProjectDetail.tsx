import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { MapPin, ArrowLeft, Check, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import project1 from '@/assets/images/office-building.webp';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Project {
  id: number;
  title: string;
  location: string;
  type: string;
  status: string;
  description: string;
  imageUrl: string | null;
  featured: boolean;
  details: string | null;
  amenities: string | null;
  specifications: string | null;
}

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`${API_URL}/api/projects/${slug}`);
        if (!response.ok) throw new Error('Project not found');
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProject();
    }
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className='min-h-screen flex items-center justify-center'>
          <p className='text-muted-foreground text-lg'>Loading project...</p>
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <h1 className='heading-display text-foreground mb-4'>
              Project Not Found
            </h1>
            <p className='text-muted-foreground mb-6'>
              The project you're looking for doesn't exist.
            </p>
            <Link to='/projects'>
              <Button>Back to Projects</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Parse amenities and specifications if they exist
  const amenitiesList = project.amenities
    ? project.amenities.split('\n').filter(Boolean)
    : [];
  const specsList = project.specifications
    ? project.specifications.split('\n').filter(Boolean)
    : [];

  return (
    <Layout>
      {/* Hero */}
      <section className='relative min-h-[60vh] flex items-end'>
        <div className='absolute inset-0'>
          <img
            src={project.imageUrl || project1}
            alt={project.title}
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 gradient-hero' />
        </div>

        <div className='container-custom relative z-10 pb-12 pt-32'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              to='/projects'
              className='inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors'
            >
              <ArrowLeft className='w-4 h-4' />
              Back to Projects
            </Link>
            <div className='flex flex-wrap gap-3 mb-4'>
              <span className='px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-sm'>
                {project.status}
              </span>
              <span className='px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-sm'>
                {project.type}
              </span>
              {project.featured && (
                <span className='px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-sm'>
                  Featured
                </span>
              )}
            </div>
            <h1 className='heading-display text-primary-foreground mb-4'>
              {project.title}
            </h1>
            <div className='flex items-center gap-2 text-primary-foreground/80'>
              <MapPin className='w-5 h-5' />
              <span className='text-lg'>{project.location}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className='section-padding bg-background'>
        <div className='container-custom'>
          <div className='grid lg:grid-cols-3 gap-12'>
            {/* Main Content */}
            <div className='lg:col-span-2 space-y-12'>
              {/* Overview */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className='heading-card text-foreground mb-4'>Overview</h2>
                <p className='text-muted-foreground text-body leading-relaxed whitespace-pre-line'>
                  {project.description}
                </p>
                {project.details && (
                  <p className='text-muted-foreground text-body leading-relaxed mt-4 whitespace-pre-line'>
                    {project.details}
                  </p>
                )}
              </motion.div>

              {/* Specifications */}
              {specsList.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className='heading-card text-foreground mb-6'>
                    Specifications
                  </h2>
                  <div className='grid sm:grid-cols-2 gap-4'>
                    {specsList.map((spec, index) => (
                      <div
                        key={index}
                        className='flex items-start gap-3 p-4 bg-card rounded-sm'
                      >
                        <div className='w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                          <Check className='w-4 h-4 text-primary' />
                        </div>
                        <span className='text-foreground'>{spec}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Amenities */}
              {amenitiesList.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className='heading-card text-foreground mb-6'>
                    Amenities
                  </h2>
                  <div className='grid sm:grid-cols-2 gap-4'>
                    {amenitiesList.map((amenity, index) => (
                      <div
                        key={index}
                        className='flex items-start gap-3 p-4 bg-card rounded-sm'
                      >
                        <div className='w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                          <Check className='w-4 h-4 text-secondary' />
                        </div>
                        <span className='text-foreground'>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className='lg:col-span-1'>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className='sticky top-32 p-8 bg-card rounded-sm card-elevated'
              >
                <h3 className='heading-card text-foreground mb-6'>
                  Interested?
                </h3>
                <p className='text-muted-foreground text-sm mb-6'>
                  Contact us for more information about this project or to
                  schedule a viewing.
                </p>
                <div className='space-y-4'>
                  <Link to='/contact' className='block'>
                    <Button variant='default' className='w-full'>
                      Request Information
                    </Button>
                  </Link>
                  <Button variant='outline' className='w-full'>
                    <Download className='w-4 h-4' />
                    Download Brochure
                  </Button>
                </div>
                <div className='mt-8 pt-6 border-t border-border'>
                  <p className='text-sm text-muted-foreground mb-2'>
                    Sales Hotline
                  </p>
                  <a
                    href='tel:+9714123456'
                    className='text-lg font-semibold text-foreground hover:text-primary transition-colors'
                  >
                    19640
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectDetail;
