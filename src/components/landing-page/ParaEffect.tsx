import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { backgroundDarkImage, officeBuildingImage } from '@/assets';
import ScrollTextMarque from '@/components/ui/scroll-text-marque';
import '@/styles/sections/ParaEffect.css';

function useViewportSize() {
  const [size, setSize] = useState({ width: 1280, height: 800 });

  useEffect(() => {
    const updateSize = () => {
      setSize({
        width: window.innerWidth || 1280,
        height: window.innerHeight || 800,
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}

const ParaEffect = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(false);
  const { height: viewportHeight } = useViewportSize();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', '100vh start'],
  });

  const smoothProgress = useSpring(
    scrollYProgress,
    useMemo(
      () => ({
        stiffness: 64,
        damping: 30,
        restDelta: 0.001,
      }),
      [],
    ),
  );

  const mountainDepth = Math.min(14, Math.max(6, viewportHeight * 0.014));
  const mountainY = useTransform(smoothProgress, [0, 1], [0, mountainDepth]);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsActive(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      {
        rootMargin: '320px 0px',
        threshold: 0,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id='para-effect-section'
      style={{
        backgroundImage: `linear-gradient(180deg, hsl(var(--brand-black) / 0.2), hsl(var(--brand-black-900) / 0.42)), url(${backgroundDarkImage})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div className='para-effect-marquee para-effect-marquee--front'>
        <ScrollTextMarque
          animate={isActive}
          baseVelocity={-0.35}
          className='para-effect-marquee-text'
        >
          wealth holding wealth holding
        </ScrollTextMarque>
      </div>

      <div className='para-effect-marquee para-effect-marquee--back'>
        <ScrollTextMarque
          animate={isActive}
          baseVelocity={0.35}
          className='para-effect-marquee-text para-effect-marquee-text--accent'
        >
          live the spotlight live the spotlight
        </ScrollTextMarque>
      </div>

      <div className='para-effect-building-wrap'>
        <motion.img
          src={officeBuildingImage}
          alt='Office building'
          draggable={false}
          className='para-effect-building'
          style={{ y: isActive ? mountainY : 0 }}
        />
      </div>

      <div className='para-effect-building-fade' aria-hidden='true' />
    </section>
  );
};

export default ParaEffect;
