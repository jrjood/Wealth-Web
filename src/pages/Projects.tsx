import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Building2, Filter, MapPin } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import ParaEffect from '@/components/landing-page/ParaEffect';
import { officeBuildingImage } from '@/assets';
import { useSEO } from '@/hooks/useSEO';
import { resolveMediaUrl } from '@/lib/media';
import { getProjectSlug } from '@/lib/projectSlug';
import './Projects.css';

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

type VisibleProject = Project & {
  image: string;
  locationLabel: string;
  slug: string;
  statusLabel: string;
};

const types = ['Residential', 'Commercial'];
const statuses = ['Completed', 'Selling Now', 'Under Construction'];

const getPrimaryLocation = (location: string) =>
  location.split(',')[0]?.trim() || location;

const getStatusLabel = (status: string) =>
  status === 'Selling Now' ? 'Launching' : status;

const Projects = () => {
  useSEO({
    title: 'Our Projects | Wealth Holding',
    description:
      'Explore our portfolio of iconic developments that define luxury living and commercial excellence in Egypt.',
  });

  const [typeFilter, setTypeFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroActive, setHeroActive] = useState(true);
  const heroRef = useRef<HTMLElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/api/projects`, {
          signal: controller.signal,
        });
        const data = await response.json();
        setAllProjects(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        console.error('Error fetching projects:', error);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => controller.abort();
  }, []);

  const locations = useMemo(
    () => [
      ...Array.from(
        new Set(
          allProjects
            .map((project) => getPrimaryLocation(project.location))
            .filter(Boolean),
        ),
      ),
    ],
    [allProjects],
  );

  const filteredProjects = useMemo(
    () =>
      allProjects.filter((project) => {
        const normalizedType = project.type.toLowerCase();
        const projectLocation = getPrimaryLocation(project.location);
        const typeMatch =
          typeFilter === 'All' ||
          (typeFilter === 'Residential' &&
            normalizedType.includes('residential')) ||
          (typeFilter === 'Commercial' &&
            normalizedType.includes('commercial'));
        const locationMatch =
          locationFilter === 'All' || projectLocation === locationFilter;
        const statusMatch =
          statusFilter === 'All' || project.status === statusFilter;
        return typeMatch && locationMatch && statusMatch;
      }),
    [allProjects, locationFilter, statusFilter, typeFilter],
  );

  const visibleProjects = useMemo(
    () =>
      filteredProjects.map((project) => ({
        ...project,
        image: resolveMediaUrl(project.imageUrl, API_URL) || officeBuildingImage,
        locationLabel: getPrimaryLocation(project.location),
        slug: getProjectSlug(project),
        statusLabel: getStatusLabel(project.status),
      })),
    [filteredProjects],
  );

  const leadProject =
    allProjects.find((project) => project.featured) ?? allProjects[0];
  const heroImage =
    resolveMediaUrl(leadProject?.imageUrl ?? null, API_URL) ||
    officeBuildingImage;
  const activeFilterCount =
    Number(typeFilter !== 'All') +
    Number(locationFilter !== 'All') +
    Number(statusFilter !== 'All');

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroActive(entry.isIntersecting);
      },
      {
        rootMargin: '160px 0px',
        threshold: 0,
      },
    );

    observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = pageRef.current;

    if (!root) {
      return;
    }

    const revealElements = Array.from(
      root.querySelectorAll<HTMLElement>('.projects-reveal'),
    );

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealElements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.16,
      },
    );

    const animationFrame = window.requestAnimationFrame(() => {
      revealElements.forEach((element) => observer.observe(element));
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [loading, visibleProjects.length, typeFilter, locationFilter, statusFilter]);

  const resetFilters = useCallback(() => {
    setTypeFilter('All');
    setLocationFilter('All');
    setStatusFilter('All');
  }, []);

  const toggleTypeFilter = useCallback((type: string) => {
    setTypeFilter((current) => (current === type ? 'All' : type));
  }, []);

  const toggleLocationFilter = useCallback((location: string) => {
    setLocationFilter((current) => (current === location ? 'All' : location));
  }, []);

  const toggleStatusFilter = useCallback((status: string) => {
    setStatusFilter((current) => (current === status ? 'All' : status));
  }, []);

  return (
    <Layout>
      <div ref={pageRef} className='projects-page'>
        <section
          ref={heroRef}
          className={`projects-hero${heroActive ? ' is-active' : ''}`}
        >
          <img src={heroImage} alt='' className='projects-hero-image' />
          <div className='projects-hero-overlay' />

          <div className='container-custom projects-hero-inner'>
            <div className='projects-hero-copy projects-hero-copy-reveal'>
              <span className='projects-kicker'>
                <span />
                Wealth Portfolio
              </span>
              <h1>Our Projects</h1>
              <p>
                Explore developments shaped around premium locations, strong
                commercial logic, and a refined daily experience.
              </p>
            </div>
          </div>
        </section>

        <section className='projects-filter-bar projects-reveal'>
          <div className='projects-filter-shell'>
            <div className='projects-filter-label'>
              <Filter aria-hidden='true' />
              <span>Filter</span>
            </div>
            <FilterButton
              active={activeFilterCount === 0}
              onClick={resetFilters}
            >
              All
            </FilterButton>
            <div className='projects-filter-groups'>
              <div className='projects-filter-group' aria-label='Project type'>
                <span className='projects-filter-group-label'>Type</span>
                {types.map((type) => (
                  <FilterButton
                    key={type}
                    active={typeFilter === type}
                    onClick={() => toggleTypeFilter(type)}
                  >
                    {type}
                  </FilterButton>
                ))}
              </div>

              <div
                className='projects-filter-group projects-filter-group-wide'
                aria-label='Project location'
              >
                <span className='projects-filter-group-label'>Location</span>
                {locations.map((location) => (
                  <FilterButton
                    key={location}
                    active={locationFilter === location}
                    onClick={() => toggleLocationFilter(location)}
                  >
                    {location}
                  </FilterButton>
                ))}
              </div>

              <div
                className='projects-filter-group'
                aria-label='Project status'
              >
                <span className='projects-filter-group-label'>Status</span>
                {statuses.map((status) => (
                  <FilterButton
                    key={status}
                    active={statusFilter === status}
                    accent
                    onClick={() => toggleStatusFilter(status)}
                  >
                    {getStatusLabel(status)}
                  </FilterButton>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className='projects-index'>
          <div className='container-custom'>
            <div className='projects-index-head projects-reveal'>
              <div>
                <h2>{visibleProjects.length} Projects</h2>
              </div>
              <p>
                Browse the collection through large visual entries, direct
                status cues, and clear routes into each development detail page.
              </p>
            </div>

            {loading ? (
              <div className='projects-grid projects-grid-loading'>
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className='project-skeleton projects-reveal'
                    style={
                      {
                        '--reveal-delay': `${Math.min(index, 5) * 45}ms`,
                      } as CSSProperties
                    }
                  >
                    <div />
                    <span />
                    <span />
                  </div>
                ))}
              </div>
            ) : visibleProjects.length === 0 ? (
              <div className='projects-empty projects-reveal'>
                <Building2 aria-hidden='true' />
                <h3>No Projects Found</h3>
                <p>
                  Reset the filters to return to the full project collection.
                </p>
                <button type='button' onClick={resetFilters}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className='projects-grid'>
                {visibleProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <LazyParaEffect />
      </div>
    </Layout>
  );
};

const LazyParaEffect = () => {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const placeholder = placeholderRef.current;

    if (!placeholder || shouldMount) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '900px 0px',
        threshold: 0,
      },
    );

    observer.observe(placeholder);

    return () => observer.disconnect();
  }, [shouldMount]);

  if (shouldMount) {
    return <ParaEffect />;
  }

  return (
    <div
      ref={placeholderRef}
      className='projects-para-placeholder'
      aria-hidden='true'
    />
  );
};

const ProjectCard = memo(
  ({ project, index }: { project: VisibleProject; index: number }) => (
    <article
      className='project-card projects-reveal'
      style={
        {
          '--reveal-delay': `${Math.min(index, 8) * 45}ms`,
        } as CSSProperties
      }
    >
      <Link to={`/projects/${project.slug}`}>
        <div className='project-card-media'>
          <img
            src={project.image}
            alt={project.title}
            loading={index < 2 ? 'eager' : 'lazy'}
            decoding='async'
            fetchPriority={index < 2 ? 'high' : 'auto'}
          />
          <div className='project-card-tags'>
            <span>{project.type}</span>
            <span>{project.statusLabel}</span>
          </div>
        </div>

        <div className='project-card-body'>
          <div>
            <h3>{project.title}</h3>
            <div className='project-card-location'>
              <MapPin aria-hidden='true' />
              <span>{project.locationLabel}</span>
            </div>
            <p>{project.description}</p>
          </div>

          <div className='project-card-action'>
            <span>View Project</span>
            <span className='project-card-action-icon'>
              <ArrowUpRight aria-hidden='true' />
            </span>
          </div>
        </div>
      </Link>
    </article>
  ),
);

ProjectCard.displayName = 'ProjectCard';

const FilterButton = ({
  active,
  accent = false,
  children,
  onClick,
}: {
  active: boolean;
  accent?: boolean;
  children: string;
  onClick: () => void;
}) => (
  <button
    type='button'
    className={`projects-filter-button${active ? ' is-active' : ''}${
      accent ? ' is-accent' : ''
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Projects;
