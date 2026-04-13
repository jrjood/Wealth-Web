import { useEffect, useRef } from 'react';

import { aboutOneImage } from '@/assets';
import ScrollTextMarque from '@/components/ui/scroll-text-marque';

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
      className='relative w-screen overflow-hidden bg-[hsl(var(--brand-cream))]'
    >
      <div className='relative z-[2] overflow-hidden px-0 pb-2 pt-1 md:pb-2 md:pt-1'>
        <ScrollTextMarque
          baseVelocity={-1}
          className='pr-[1.3rem] text-[clamp(4rem,8vw,7rem)] font-light italic leading-[0.86] tracking-[-0.08em] text-[hsl(var(--brand-black)/0.52)]'
        >
          we build wealth that lasts
        </ScrollTextMarque>
      </div>

      <div className='relative h-[58vh] min-h-96 w-full overflow-hidden bg-[radial-gradient(circle_at_center,hsl(var(--brand-white)/0.08),transparent_40%),hsl(var(--brand-black-900))] md:h-[72vh] md:min-h-[32rem]'>
        <video
          ref={videoRef}
          className='block h-full w-full object-cover [backface-visibility:hidden] [transform:translateZ(0)]'
          autoPlay
          muted
          loop
          playsInline
          poster={aboutOneImage}
          preload='metadata'
        >
          <source
            src='https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
            type='video/mp4'
          />
        </video>

        <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--brand-black)/0.14)_0%,transparent_24%,transparent_62%,hsl(var(--brand-black)/0.3)_100%),linear-gradient(90deg,hsl(var(--brand-black)/0.1)_0%,transparent_45%,hsl(var(--brand-black)/0.16)_100%)]' />
      </div>
    </section>
  );
};

export default VideoShowcaseSection;
