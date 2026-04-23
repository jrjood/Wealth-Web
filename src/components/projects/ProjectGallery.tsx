import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { ImageLightbox } from '@/components/projects/ImageLightbox';

interface GalleryImage {
  id: string;
  imageUrl: string;
  title?: string | null;
  sortOrder?: number;
}

interface ProjectGalleryProps {
  images: GalleryImage[];
  title?: string;
}

export const ProjectGallery = ({
  images,
  title = 'Gallery',
}: ProjectGalleryProps) => {
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [autoSlideTick, setAutoSlideTick] = useState(0);

  const sortedImages = [...images].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
  const currentImage = sortedImages[currentIndex] || sortedImages[0];
  const nextImage =
    sortedImages[(currentIndex + 1) % sortedImages.length] || currentImage;
  const hasMultipleImages = sortedImages.length > 1;

  useEffect(() => {
    if (!hasMultipleImages || activeImage) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setSlideDirection(1);
      setCurrentIndex((current) => (current + 1) % sortedImages.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [activeImage, autoSlideTick, hasMultipleImages, sortedImages.length]);

  if (images.length === 0) {
    return null;
  }

  const goPrevious = () => {
    setSlideDirection(-1);
    setAutoSlideTick((current) => current + 1);
    setCurrentIndex(
      (current) => (current - 1 + sortedImages.length) % sortedImages.length,
    );
  };

  const goNext = () => {
    setSlideDirection(1);
    setAutoSlideTick((current) => current + 1);
    setCurrentIndex((current) => (current + 1) % sortedImages.length);
  };

  return (
    <>
      <section className='relative min-w-0 overflow-hidden bg-[hsl(var(--brand-black-800))] px-4 py-10 sm:px-8 sm:py-12 lg:px-10'>
        <div className='mb-10 flex min-w-0 flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between'>
          <h2 className='break-words text-4xl font-black uppercase tracking-[0.08em] text-[hsl(var(--brand-gold))] sm:text-5xl md:text-7xl'>
            {title}
          </h2>
          <div className='flex items-center gap-4 text-sm font-semibold tracking-[0.16em] text-white/60'>
            <span className='text-[hsl(var(--brand-gold))]'>
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span>/</span>
            <span>{String(sortedImages.length).padStart(2, '0')}</span>
          </div>
        </div>

        <div className='relative min-w-0 overflow-hidden px-0 sm:px-2'>
          <button
            type='button'
            onClick={goPrevious}
            disabled={!hasMultipleImages}
            className='absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-[hsl(var(--brand-black-700))] text-white shadow-[0_1rem_2rem_rgba(0,0,0,0.25)] transition-all duration-500 ease-out hover:bg-[hsl(var(--brand-gold))] hover:text-[hsl(var(--brand-black))] disabled:cursor-not-allowed disabled:opacity-40 sm:h-12 sm:w-12 lg:h-14 lg:w-14'
            aria-label='Previous gallery image'
          >
            <ChevronLeft className='h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7' />
          </button>

          <AnimatePresence initial={false} mode='wait'>
            <motion.div
              key={`gallery-slide-${currentImage.id}-${nextImage.id}`}
              className='grid min-w-0 items-center gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-10'
              initial={{ opacity: 0, x: slideDirection * 72 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: slideDirection * -72 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <GalleryConceptItem
                image={currentImage}
                index={currentIndex}
                onPreview={() => setActiveImage(currentImage)}
                emphasis='primary'
              />

              <GalleryConceptItem
                image={nextImage}
                index={(currentIndex + 1) % sortedImages.length}
                onPreview={() => setActiveImage(nextImage)}
                emphasis='secondary'
                className='hidden lg:grid'
              />
            </motion.div>
          </AnimatePresence>

          <button
            type='button'
            onClick={goNext}
            disabled={!hasMultipleImages}
            className='absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-[hsl(var(--brand-black-700))] text-white shadow-[0_1rem_2rem_rgba(0,0,0,0.25)] transition-all duration-500 ease-out hover:bg-[hsl(var(--brand-gold))] hover:text-[hsl(var(--brand-black))] disabled:cursor-not-allowed disabled:opacity-40 sm:h-12 sm:w-12 lg:h-14 lg:w-14'
            aria-label='Next gallery image'
          >
            <ChevronRight className='h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7' />
          </button>
        </div>

        <div className='mt-14 flex justify-center'>
          <div className='flex max-w-full gap-3 overflow-x-auto px-1 pb-2'>
            {sortedImages.map((image, index) => (
              <button
                key={image.id}
                type='button'
                onClick={() => {
                  setSlideDirection(index >= currentIndex ? 1 : -1);
                  setAutoSlideTick((current) => current + 1);
                  setCurrentIndex(index);
                }}
                className={`h-1.5 w-12 shrink-0 transition-all duration-500 ease-out hover:w-16 ${
                  index === currentIndex
                    ? 'w-16 bg-[hsl(var(--brand-gold))]'
                    : 'bg-white/15 hover:bg-white/35'
                }`}
                aria-label={`Show gallery image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {activeImage ? (
        <ImageLightbox
          open={Boolean(activeImage)}
          onOpenChange={(open) => {
            if (!open) {
              setActiveImage(null);
            }
          }}
          imageUrl={activeImage.imageUrl}
          alt='Project gallery preview'
        />
      ) : null}
    </>
  );
};

const GalleryConceptItem = ({
  image,
  index,
  onPreview,
  emphasis,
  className = '',
}: {
  image: GalleryImage;
  index: number;
  onPreview: () => void;
  emphasis: 'primary' | 'secondary';
  className?: string;
}) => (
  <article
    className={`group/item grid min-w-0 items-end gap-7 transition-all duration-500 ease-out ${
      emphasis === 'primary'
        ? 'lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.82fr)]'
        : 'lg:grid-cols-[minmax(0,1fr)_minmax(0,0.62fr)]'
    } ${className}`}
  >
    <div className='relative min-h-48 min-w-0 px-3 sm:min-h-56 sm:px-5 lg:px-0'>
      <span
        aria-hidden='true'
        className='absolute left-0 top-0 h-full w-3/5 bg-[hsl(var(--brand-gold)/0.72)] shadow-[0_1.2rem_3rem_rgba(0,0,0,0.24)] transition-all duration-500 ease-out group-hover/item:bg-[hsl(var(--brand-gold)/0.9)] sm:-top-5 sm:h-[calc(100%+2.5rem)]'
      />
      <button
        type='button'
        onClick={onPreview}
        className='group relative z-[1] block w-full overflow-hidden text-left shadow-[0_1.4rem_3rem_rgba(0,0,0,0.34)] transition-all duration-500 ease-out hover:shadow-[0_1.8rem_4rem_rgba(0,0,0,0.42)]'
      >
        <img
          src={image.imageUrl}
          alt={image.title || `Project gallery image ${index + 1}`}
          className='aspect-[4/3] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]'
        />
        <span className='absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:opacity-100'>
          <Expand className='h-4 w-4' />
        </span>
      </button>
    </div>

    <div className='min-w-0 pb-2 pl-3 transition-transform duration-500 ease-out sm:pl-5 lg:pl-0'>
      <h3 className='break-words text-2xl font-medium leading-tight text-white transition-colors duration-500 group-hover/item:text-[hsl(var(--brand-gold))] sm:text-3xl'>
        {image.title || `Gallery ${String(index + 1).padStart(2, '0')}`}
      </h3>
      <span className='my-5 block h-px w-full bg-[hsl(var(--brand-gold)/0.72)] transition-all duration-500 ease-out group-hover/item:w-4/5 group-hover/item:shadow-[0_0_1rem_hsl(var(--brand-gold)/0.4)]' />
    </div>
  </article>
);
