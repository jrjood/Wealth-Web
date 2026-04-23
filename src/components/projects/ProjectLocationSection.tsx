import { useMemo, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { ArrowUpRight, Expand, MapPin, Navigation } from 'lucide-react';
import { ImageLightbox } from '@/components/projects/ImageLightbox';

interface NearbyLocation {
  id: string;
  name: string;
  distance: string;
  sortOrder?: number;
}

interface ProjectLocationSectionProps {
  imageUrl: string;
  locations: NearbyLocation[];
  directionsUrl?: string | null;
}

const revealViewport = { once: true, amount: 0.18 };

const revealGroup: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06,
    },
  },
};

const revealItem: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
  },
};

const revealLeft: Variants = {
  hidden: { opacity: 0, x: -26, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
};

const revealRight: Variants = {
  hidden: { opacity: 0, x: 26, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
};

const formatDistance = (distance: string) => {
  const match = distance.trim().match(/^(\d+(?:\.\d+)?)\s*(.*)$/);

  if (!match) {
    return {
      value: distance,
      unit: '',
    };
  }

  return {
    value: match[1],
    unit: match[2] || 'mins',
  };
};

export const ProjectLocationSection = ({
  imageUrl,
  locations,
  directionsUrl,
}: ProjectLocationSectionProps) => {
  const [locationMapOpen, setLocationMapOpen] = useState(false);
  const safeLocations = useMemo(
    () => (Array.isArray(locations) ? locations : []),
    [locations],
  );

  const sortedLocations = useMemo(
    () =>
      [...safeLocations].sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
      ),
    [safeLocations],
  );

  if (!imageUrl && safeLocations.length === 0 && !directionsUrl) {
    return null;
  }

  return (
    <motion.section
      initial='hidden'
      whileInView='visible'
      viewport={revealViewport}
      variants={revealGroup}
      className='relative min-w-0 overflow-hidden px-4 py-10 sm:px-8 sm:py-12 lg:px-10'
    >
      <div className='mb-8 flex min-w-0 flex-col gap-5 sm:flex-row sm:items-end sm:justify-between'>
        <motion.div variants={revealLeft} className='min-w-0'>
          <p className='mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/55'>
            <MapPin className='h-4 w-4 text-[hsl(var(--brand-gold))]' />
            Project Map
          </p>
          <h2 className='break-words text-left text-4xl font-black uppercase tracking-[0.08em] text-[hsl(var(--brand-gold))] sm:text-5xl md:text-7xl'>
            Location
          </h2>
        </motion.div>

        {directionsUrl ? (
          <motion.a
            variants={revealRight}
            href={directionsUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='group inline-flex w-full max-w-full items-center justify-between gap-3 border border-[hsl(var(--brand-gold)/0.62)] bg-[hsl(var(--brand-gold)/0.08)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-all duration-500 ease-out hover:-translate-y-1 hover:bg-[hsl(var(--brand-gold))] hover:text-[hsl(var(--brand-black))] hover:shadow-[0_1rem_2.5rem_rgba(0,0,0,0.28)] sm:w-fit sm:justify-start sm:px-5 sm:text-sm sm:tracking-[0.18em]'
          >
            <span className='flex h-9 w-9 items-center justify-center border border-current/45'>
              <Navigation className='h-4 w-4 transition-transform duration-500 group-hover:rotate-45' />
            </span>
            Get Directions
            <ArrowUpRight className='h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1' />
          </motion.a>
        ) : null}
      </div>

      <div className='grid min-w-0 gap-8'>
        {imageUrl ? (
          <motion.section variants={revealItem} className='min-w-0 space-y-4'>
            <button
              type='button'
              onClick={() => setLocationMapOpen(true)}
              className='group relative block w-full min-w-0 overflow-hidden bg-[hsl(var(--brand-black-700))] shadow-[0_22px_70px_rgba(0,0,0,0.42)]'
            >
              <img
                src={imageUrl}
                alt='Project location'
                className='aspect-[16/11] w-full object-cover transition duration-500 group-hover:scale-[1.02]'
              />
              <span className='absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm'>
                <Expand className='h-4 w-4' />
              </span>
            </button>
          </motion.section>
        ) : null}

        {sortedLocations.length > 0 ? (
          <motion.div variants={revealGroup} className='min-w-0 space-y-6'>
            <motion.div variants={revealItem} className='min-w-0'>
              <p className='mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[hsl(var(--brand-gold))]'>
                <MapPin className='h-4 w-4' />
                Surroundings
              </p>
              <h3 className='heading-card text-white'>Nearby Landmarks</h3>
            </motion.div>

            <motion.div
              variants={revealGroup}
              className='grid min-w-0 grid-cols-2 gap-3 xl:grid-cols-4'
            >
              {sortedLocations.map((location) => {
                const distance = formatDistance(location.distance);

                return (
                  <motion.div
                    key={location.id}
                    variants={revealItem}
                    className='group min-w-0 border border-[hsl(var(--brand-gold)/0.3)] bg-white/[0.04] p-4 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[hsl(var(--brand-gold)/0.65)] hover:bg-white/[0.07]'
                  >
                    <div className='mb-3 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1'>
                      <span className='text-3xl font-semibold leading-none tabular-nums text-[hsl(var(--brand-gold))] transition-transform duration-500 group-hover:scale-105 sm:text-4xl'>
                        {distance.value}
                      </span>
                      {distance.unit ? (
                        <span className='break-words text-xs font-semibold uppercase tracking-[0.12em] text-[hsl(var(--brand-gold))] sm:text-sm sm:tracking-[0.14em]'>
                          {distance.unit}
                        </span>
                      ) : null}
                    </div>

                    <p className='mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/45'>
                      From:
                    </p>
                    <p className='break-words text-sm font-semibold leading-6 text-white/88'>
                      {location.name}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        ) : directionsUrl ? (
          <motion.div variants={revealItem} className='space-y-8'>
            <div>
              <p className='mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[hsl(var(--brand-gold))]'>
                <MapPin className='h-4 w-4' />
                Surroundings
              </p>
              <h3 className='heading-card text-foreground'>Project Location</h3>
            </div>
          </motion.div>
        ) : null}
      </div>

      {imageUrl ? (
        <ImageLightbox
          open={locationMapOpen}
          onOpenChange={setLocationMapOpen}
          imageUrl={imageUrl}
          alt='Project location map'
        />
      ) : null}
    </motion.section>
  );
};
