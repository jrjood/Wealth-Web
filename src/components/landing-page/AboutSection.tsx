import { useEffect, useRef, useState } from 'react';

import { brandGuidelinesImage } from '@/assets';
import { cn } from '@/lib/utils';

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '-8% 0px -8% 0px',
        threshold: 0.4,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      id='page2'
      ref={sectionRef}
      data-scroll
      data-scroll-speed='0'
      className='relative isolate flex min-h-screen w-screen flex-col items-start justify-center overflow-hidden px-6 text-white md:h-screen md:px-10 lg:px-16'
    >
      <div
        aria-hidden='true'
        className={cn(
          'absolute inset-0 -z-[1] scale-105 bg-cover bg-center bg-fixed opacity-0 transition-[opacity,transform] duration-1000 [will-change:opacity,transform]',
          isVisible && 'scale-100 opacity-100',
        )}
        style={{ backgroundImage: `url(${brandGuidelinesImage})` }}
      />

      <h3 className='relative z-50 text-sm font-light uppercase text-[hsl(var(--brand-white))] md:text-lg'>
        About Wealth Holding
      </h3>
      <h1 className='relative z-50 mt-10 text-3xl font-light leading-relaxed text-white/40 md:mt-14 md:text-5xl lg:text-6xl'>
        With over two decades of experience, Wealth Holding delivers integrated
        real estate developments, combining design excellence, smart investment
        strategies, and long-term value to build thriving communities and
        lasting client trust.
      </h1>
    </div>
  );
};

export default AboutSection;
