import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { brandGuidelinesImage } from '@/assets';
import AnimatedPillButton from '@/components/ui/AnimatedPillButton';
import { cn } from '@/lib/utils';

const AboutSection = () => {
  const navigate = useNavigate();
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
        threshold: 0.1,
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
      data-scroll-speed='-1'
      className='relative isolate flex min-h-screen w-full flex-col items-start justify-center overflow-hidden px-5 pb-24 text-white sm:px-6 sm:pb-32 md:h-[100dvh] md:px-10 md:pb-0 lg:px-16 text-left'
    >
      <div
        aria-hidden='true'
        className={cn(
          'absolute inset-0 -z-[1] scale-105 bg-cover bg-center opacity-0 transition-[opacity,transform] duration-1000 [will-change:opacity,transform] md:bg-fixed',
          isVisible && 'scale-100 opacity-100',
        )}
        style={{ backgroundImage: `url(${brandGuidelinesImage})` }}
      />

      {/*   <h3 className='relative z-50 text-sm font-light uppercase text-[hsl(var(--brand-white))] md:text-lg'>
        About Wealth Holding
      </h3> */}
      <h1
        data-preserve-inline-colors='true'
        className='relative z-50 mt-8 w-full text-[clamp(1.6rem,6.2vw,2.65rem)] font-light leading-[1.24] text-white/40 sm:mt-10 md:mt-14 md:text-[clamp(2.6rem,4.8vw,4.4rem)] md:leading-[1.18] lg:text-6xl text-left'
      >
        Leading real estate developer in Egypt, delivering integrated projects
        in prime locations with strong investment returns.
        <span
          data-keep-color='true'
          style={{ color: 'hsl(var(--brand-red-100))', fontWeight: 'bold' }}
        >
          {' '}
          With 20+ years{' '}
        </span>
        of experience, we help you grow your real estate investment with
        confidence.
      </h1>

      <div className='relative z-50 mt-8 md:mt-12 flex justify-start w-full'>
        <AnimatedPillButton
          label='Explore Opportunities'
          tone='brand'
          className='w-full justify-center !border-0 sm:w-auto'
          labelClassName='text-sm md:text-base'
          onClick={() => navigate('/projects')}
        />
      </div>
    </div>
  );
};

export default AboutSection;
