import { useEffect, useRef } from 'react';

import { aboutOneImage } from '@/assets';
import showcaseVideo from '@/assets/video.mp4';

const VideoShowcaseSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !videoRef.current) {
      return;
    }

    const video = videoRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const playPromise = video.play();
          playPromise?.catch(() => {});
          return;
        }

        video.pause();
      },
      {
        rootMargin: '120px 0px 120px 0px',
        threshold: 0.2,
      },
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id='video-showcase-section'
      ref={sectionRef}
      data-scroll
      data-scroll-speed='0'
      className='relative w-full overflow-hidden bg-[hsl(var(--brand-cream))]'
    >
      <div className='relative aspect-[18/9] min-h-[10rem] w-full overflow-hidden bg-[radial-gradient(circle_at_center,hsl(var(--brand-white)/0.08),transparent_40%),hsl(var(--brand-black-900))] sm:aspect-[18/9] md:aspect-[19/9] lg:aspect-[21/9]'>
        <video
          ref={videoRef}
          className='block h-full w-full object-cover object-bottom [backface-visibility:hidden] [transform:translateZ(0)]'
          autoPlay
          muted
          loop
          playsInline
          poster={aboutOneImage}
          preload='metadata'
        >
          <source src={showcaseVideo} type='video/mp4' />
        </video>

        <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--brand-black)/0.14)_0%,transparent_24%,transparent_62%,hsl(var(--brand-black)/0.3)_100%),linear-gradient(90deg,hsl(var(--brand-black)/0.1)_0%,transparent_45%,hsl(var(--brand-black)/0.16)_100%)]' />
      </div>
    </section>
  );
};

export default VideoShowcaseSection;
