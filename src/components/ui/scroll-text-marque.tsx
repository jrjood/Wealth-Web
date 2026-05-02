import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

import { wrap } from '@motionone/utils';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';

import { cn } from '@/lib/utils';

type ScrollTextMarqueProps = {
  animate?: boolean;
  baseVelocity?: number;
  children: ReactNode;
  className?: string;
  delay?: number;
  scrollDependent?: boolean;
};

const ScrollTextMarque = ({
  children,
  baseVelocity = -5,
  className,
  animate = true,
  scrollDependent = false,
  delay = 0,
}: ScrollTextMarqueProps) => {
  const baseX = useMotionValue(0);
  const scrollVelocity = useMotionValue(0);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2], {
    clamp: false,
  });
  const x = useTransform(baseX, (value) => `${wrap(-50, 0, value)}%`);
  const shouldAnimate = animate && baseVelocity !== 0;
  const directionFactor = useRef(1);
  const hasStarted = useRef(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      hasStarted.current = true;
    }, delay);

    return () => window.clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!shouldAnimate) {
      scrollVelocity.set(0);
      return;
    }

    const source = window.__locoScroll;

    if (source) {
      const handleScroll = (data: LenisScrollEvent) => {
        scrollVelocity.set((data.velocity ?? 0) * 100);
      };

      source.on('scroll', handleScroll);

      return () => {
        source.off('scroll', handleScroll);
      };
    }

    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      if (ticking.current) {
        return;
      }

      ticking.current = true;

      window.requestAnimationFrame(() => {
        const nextY = window.scrollY;
        const delta = nextY - lastScrollY.current;

        lastScrollY.current = nextY;
        scrollVelocity.set(delta * 60);
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollVelocity, shouldAnimate]);

  useAnimationFrame((_time, delta) => {
    if (!shouldAnimate || !hasStarted.current) {
      return;
    }

    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (scrollDependent) {
      if (velocityFactor.get() < 0) {
        directionFactor.current = -1;
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1;
      }
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  const repeatedLine = (
    <>
      <span
        className={cn(
          'block shrink-0 whitespace-nowrap [transform:translateZ(0)]',
          className,
        )}
      >
        {children}
      </span>
      <span
        className={cn(
          'block shrink-0 whitespace-nowrap [transform:translateZ(0)]',
          className,
        )}
      >
        {children}
      </span>
    </>
  );

  return shouldAnimate ? (
    <div className='flex flex-nowrap overflow-x-hidden overflow-y-visible whitespace-nowrap [contain:layout_paint]'>
      <motion.div
        className='flex flex-nowrap items-center whitespace-nowrap [backface-visibility:hidden] [will-change:transform]'
        style={{ x }}
      >
        <div className='flex shrink-0 flex-nowrap items-center gap-7 whitespace-nowrap'>
          {repeatedLine}
        </div>
        <div
          aria-hidden='true'
          className='flex shrink-0 flex-nowrap items-center gap-7 whitespace-nowrap'
        >
          {repeatedLine}
        </div>
      </motion.div>
    </div>
  ) : (
    <div className='flex overflow-x-hidden overflow-y-visible whitespace-nowrap'>
      <span className={cn('block shrink-0 whitespace-nowrap', className)}>
        {children}
      </span>
    </div>
  );
};

export default ScrollTextMarque;
