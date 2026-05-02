import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import '@/styles/sections/FeaturedProjectsSection.css';
import { resolveMediaUrl } from '@/lib/media';
import { getProjectSlug } from '@/lib/projectSlug';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const AUTOPLAY_DELAY = 5000;
const TRANSITION_DELAY = 1150;
const DRAG_THRESHOLD = 56;

type SlideDirection = 'next' | 'prev';

type FeaturedProject = {
  id: string;
  description: string;
  image: string;
  location: string;
  logo: string;
  status: string;
  title: string;
  type: string;
};

type RawFeaturedProject = {
  id?: string;
  description?: string | null;
  imageUrl?: string | null;
  location?: string | null;
  projectLogoUrl?: string | null;
  status?: string | null;
  title?: string | null;
  type?: string | null;
};

const getPrimaryLocation = (location: string) =>
  location.split(',')[0]?.trim() || '';

const getStatusLabel = (status: string) =>
  status === 'Selling Now' ? 'Launching' : status;

const AnimatedProjectTitle = ({
  title,
  variant,
}: {
  title: string;
  variant: 'in' | 'out';
}) => {
  let characterIndex = 0;

  return (
    <span
      className={`featured-projects-title-line featured-projects-title-line-${variant}`}
    >
      <span className='featured-projects-title-text'>
        {title.split(/(\s+)/).map((part, partIndex) => {
          if (/^\s+$/.test(part)) {
            return (
              <span
                key={`${variant}-space-${partIndex}`}
                className='featured-projects-title-space'
              >
                {' '}
              </span>
            );
          }

          return (
            <span
              key={`${variant}-word-${part}-${partIndex}`}
              className='featured-projects-title-word'
            >
              {Array.from(part).map((character) => {
                const currentCharacterIndex = characterIndex;
                characterIndex += 1;

                return (
                  <span
                    key={`${variant}-${character}-${currentCharacterIndex}`}
                    className='featured-projects-title-char'
                    style={
                      { '--char-index': currentCharacterIndex } as CSSProperties
                    }
                  >
                    {character}
                  </span>
                );
              })}
            </span>
          );
        })}
      </span>
    </span>
  );
};

const FeaturedProjectsSection = () => {
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>(
    [],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<SlideDirection>('next');
  const [progressKey, setProgressKey] = useState(0);
  const cleanupTimerRef = useRef<number | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchFeaturedProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/api/projects?featured=true`);
        if (!response.ok) {
          throw new Error('Failed to fetch featured projects');
        }

        const data = await response.json();

        if (!cancelled && Array.isArray(data)) {
          setFeaturedProjects(
            data.slice(0, 4).map((project: RawFeaturedProject, index) => ({
              id: project.id || `featured-project-${index}`,
              description: project.description || '',
              image: resolveMediaUrl(project.imageUrl, API_URL) || '',
              location: project.location || '',
              logo: resolveMediaUrl(project.projectLogoUrl, API_URL) || '',
              status: project.status || '',
              title: project.title || 'Featured Project',
              type: project.type || '',
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

  useEffect(() => {
    featuredProjects.forEach((project) => {
      if (!project.image) {
        return;
      }

      const image = new Image();
      image.src = project.image;
    });
  }, [featuredProjects]);

  const goToSlide = useCallback(
    (nextIndex: number, nextDirection: SlideDirection) => {
      if (featuredProjects.length <= 1 || nextIndex === currentIndex) {
        setProgressKey((key) => key + 1);
        return;
      }

      if (cleanupTimerRef.current) {
        window.clearTimeout(cleanupTimerRef.current);
      }

      setPreviousIndex(currentIndex);
      setCurrentIndex(nextIndex);
      setDirection(nextDirection);
      setProgressKey((key) => key + 1);

      cleanupTimerRef.current = window.setTimeout(() => {
        setPreviousIndex(null);
      }, TRANSITION_DELAY);
    },
    [currentIndex, featuredProjects.length],
  );

  const goNext = useCallback(() => {
    const total = featuredProjects.length;
    goToSlide((currentIndex + 1) % total, 'next');
  }, [currentIndex, featuredProjects.length, goToSlide]);

  const goPrevious = useCallback(() => {
    const total = featuredProjects.length;
    goToSlide((currentIndex - 1 + total) % total, 'prev');
  }, [currentIndex, featuredProjects.length, goToSlide]);

  const isInteractiveTarget = (target: EventTarget | null) => {
    if (!(target instanceof Element)) {
      return false;
    }

    return Boolean(
      target.closest(
        'a, button, input, textarea, select, [role="button"], .featured-projects-controls, .featured-projects-meta',
      ),
    );
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (!hasMultipleProjects || isInteractiveTarget(event.target)) {
      return;
    }

    dragStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    const dragStart = dragStartRef.current;
    dragStartRef.current = null;

    if (!dragStart || !hasMultipleProjects) {
      return;
    }

    const dragX = event.clientX - dragStart.x;
    const dragY = event.clientY - dragStart.y;

    if (
      Math.abs(dragX) < DRAG_THRESHOLD ||
      Math.abs(dragX) <= Math.abs(dragY)
    ) {
      return;
    }

    if (dragX > 0) {
      goPrevious();
    } else {
      goNext();
    }
  };

  const handlePointerCancel = () => {
    dragStartRef.current = null;
  };

  useEffect(() => {
    if (featuredProjects.length <= 1) {
      return;
    }

    const autoplayTimer = window.setTimeout(goNext, AUTOPLAY_DELAY);

    return () => {
      window.clearTimeout(autoplayTimer);
    };
  }, [featuredProjects.length, goNext, progressKey]);

  useEffect(() => {
    return () => {
      if (cleanupTimerRef.current) {
        window.clearTimeout(cleanupTimerRef.current);
      }
    };
  }, []);

  if (featuredProjects.length === 0) {
    return null;
  }

  const activeProject = featuredProjects[currentIndex];
  const outgoingProject =
    previousIndex === null ? null : featuredProjects[previousIndex];
  const totalProjects = featuredProjects.length;
  const hasMultipleProjects = totalProjects > 1;

  return (
    <section
      id='featured-projects-section'
      data-scroll
      data-scroll-speed='0'
      className='featured-projects-hero'
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      aria-roledescription='carousel'
      aria-label='Featured Projects'
    >
      <div className='featured-projects-backgrounds' aria-hidden='true'>
        {outgoingProject ? (
          <div
            key={`outgoing-${outgoingProject.id}-${progressKey}`}
            className='featured-projects-bg featured-projects-bg-out'
            data-direction={direction}
          >
            {outgoingProject.image ? (
              <img src={outgoingProject.image} alt='' />
            ) : (
              <div className='featured-projects-fallback-bg' />
            )}
          </div>
        ) : null}

        <div
          key={`active-${activeProject.id}-${progressKey}`}
          className='featured-projects-bg featured-projects-bg-in'
          data-direction={direction}
        >
          {activeProject.image ? (
            <img src={activeProject.image} alt='' />
          ) : (
            <div className='featured-projects-fallback-bg' />
          )}
        </div>
      </div>

      <div className='featured-projects-shade' aria-hidden='true' />

      <div className='featured-projects-controls'>
        <div className='featured-projects-controls-panel'>
          <span className='featured-projects-progress-track'>
            <span
              key={progressKey}
              className='featured-projects-progress-fill'
              style={{
                animationDuration: `${AUTOPLAY_DELAY}ms`,
              }}
            />
          </span>
        </div>
      </div>

      <div className='featured-projects-shell'>
        <div className='featured-projects-heading'>
          <span>Featured Projects</span>
          <h2 aria-live='polite'>
            {outgoingProject ? (
              <AnimatedProjectTitle
                title={outgoingProject.title}
                variant='out'
              />
            ) : null}
            <AnimatedProjectTitle title={activeProject.title} variant='in' />
          </h2>
          <ProjectHeroInfo project={activeProject} />
        </div>

      </div>
    </section>
  );
};

const ProjectHeroInfo = ({
  project,
}: {
  project: FeaturedProject;
}) => (
  <div className='featured-projects-meta' key={project.id}>
    <div className='featured-projects-meta-head'>
      <div className='featured-projects-meta-logo' aria-hidden='true'>
        {project.logo ? (
          <img
            src={project.logo}
            alt={`${project.title} logo`}
            className='featured-projects-meta-logo-image'
          />
        ) : (
          <span>{project.title.slice(0, 2).toUpperCase()}</span>
        )}
      </div>

      <div className='featured-projects-meta-signals'>
        {project.location ? (
          <span>{getPrimaryLocation(project.location)}</span>
        ) : null}
        {project.type ? <span>{project.type}</span> : null}
        {project.status ? <span>{getStatusLabel(project.status)}</span> : null}
      </div>
    </div>

    <div className='featured-projects-meta-body'>
      {project.description ? <p>{project.description}</p> : null}
      <div className='featured-projects-meta-actions'>
        <Link
          to={`/projects/${getProjectSlug(project)}`}
          className='featured-projects-about-link'
        >
          <span>About Project</span>
          <ArrowUpRight aria-hidden='true' />
        </Link>
        <Link to='/projects' className='featured-projects-all-link'>
          <span>Show All Projects</span>
          <ArrowUpRight aria-hidden='true' />
        </Link>
      </div>
    </div>
  </div>
);

export default FeaturedProjectsSection;
