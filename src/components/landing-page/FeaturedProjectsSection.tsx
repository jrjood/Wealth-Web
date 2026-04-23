import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import '@/styles/sections/FeaturedProjectsSection.css';
import { resolveMediaUrl } from '@/lib/media';

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

const formatProjectNumber = (value: number) => String(value).padStart(2, '0');

const AnimatedProjectTitle = ({
  title,
  variant,
}: {
  title: string;
  variant: 'in' | 'out';
}) => (
  <span
    className={`featured-projects-title-line featured-projects-title-line-${variant}`}
  >
    <span className='featured-projects-title-text'>
      {Array.from(title).map((character, index) => (
        <span
          key={`${variant}-${character}-${index}`}
          className='featured-projects-title-char'
          style={{ '--char-index': index } as CSSProperties}
        >
          {character === ' ' ? '\u00A0' : character}
        </span>
      ))}
    </span>
  </span>
);

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
        'a, button, input, textarea, select, [role="button"], .featured-projects-controls, .featured-projects-info-card',
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
  const currentProjectNumber = formatProjectNumber(currentIndex + 1);
  const totalProjectNumber = formatProjectNumber(totalProjects);
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
          <Link
            to='/projects'
            className='inline-flex items-center gap-4 rounded-full border border-white/40 px-7 py-4 text-lg transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/5'
          >
            <span className='h-px w-6 bg-current' />
            <span>Show All Projects</span>
          </Link>
        </div>

        <div className='featured-projects-controls'>
          <div className='featured-projects-control-row'>
            <button
              type='button'
              className='featured-projects-arrow'
              onClick={goPrevious}
              disabled={!hasMultipleProjects}
              aria-label='Previous featured project'
            >
              <ChevronLeft aria-hidden='true' />
            </button>

            <span className='featured-projects-counter'>
              <span className='featured-projects-counter-current'>
                <span
                  key={`counter-current-${currentProjectNumber}-${progressKey}`}
                  className='featured-projects-counter-current-value'
                >
                  {currentProjectNumber}
                </span>
              </span>
              <span className='featured-projects-counter-separator'>/</span>
              <span className='featured-projects-counter-total'>
                <span className='featured-projects-counter-total-value'>
                  {totalProjectNumber}
                </span>
              </span>
            </span>

            <button
              type='button'
              className='featured-projects-arrow'
              onClick={goNext}
              disabled={!hasMultipleProjects}
              aria-label='Next featured project'
            >
              <ChevronRight aria-hidden='true' />
            </button>
          </div>

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

        <div className='featured-projects-card-stage'>
          {outgoingProject ? (
            <ProjectInfoCard
              key={`card-out-${outgoingProject.id}-${progressKey}`}
              project={outgoingProject}
              state='out'
              direction={direction}
            />
          ) : null}
          <ProjectInfoCard
            key={`card-in-${activeProject.id}-${progressKey}`}
            project={activeProject}
            state='in'
            direction={direction}
          />
        </div>
      </div>
    </section>
  );
};

const ProjectInfoCard = ({
  project,
  state,
  direction,
}: {
  project: FeaturedProject;
  state: 'in' | 'out';
  direction: SlideDirection;
}) => (
  <article
    className='featured-projects-info-card'
    data-state={state}
    data-direction={direction}
  >
    <div className='featured-projects-logo-placeholder' aria-hidden='true'>
      {project.logo ? (
        <img
          src={project.logo}
          alt={`${project.title} logo`}
          className='featured-projects-logo-image'
        />
      ) : (
        <span>{project.title.slice(0, 2).toUpperCase()}</span>
      )}
    </div>

    <div className='featured-projects-info-content'>
      <div className='featured-projects-info-meta'>
        {[project.location, project.type, project.status]
          .filter(Boolean)
          .map((item) => (
            <span key={item}>{item}</span>
          ))}
      </div>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <Link to={`/projects/${project.id}`} className='featured-projects-link'>
        <span>Learn More</span>
        <ArrowUpRight aria-hidden='true' />
      </Link>
    </div>
  </article>
);

export default FeaturedProjectsSection;
