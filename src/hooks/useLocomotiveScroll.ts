import { useEffect } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const useLocomotiveScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    const scrollListeners = new Set<(data: LenisScrollEvent) => void>();
    const parallaxTriggers: ScrollTrigger[] = [];
    let rafId = 0;

    const handleLenisScroll = (data: {
      direction: number;
      progress: number;
      scroll: number;
      velocity: number;
    }) => {
      const eventData: LenisScrollEvent = {
        direction: data.direction,
        progress: data.progress,
        scroll: {
          y: data.scroll,
        },
        velocity: data.velocity,
      };

      scrollListeners.forEach((listener) => listener(eventData));
      ScrollTrigger.update();
    };

    const refresh = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    const initNativeParallax = () => {
      const elements = document.querySelectorAll<HTMLElement>(
        '[data-scroll][data-scroll-speed]',
      );

      elements.forEach((element) => {
        const rawSpeed = Number(element.getAttribute('data-scroll-speed'));

        if (!Number.isFinite(rawSpeed) || rawSpeed === 0) {
          return;
        }

        const distanceFactor = Math.max(-0.55, Math.min(0.55, rawSpeed * 0.12));
        const isHero = element.id === 'page1';

        const tween = gsap.fromTo(
          element,
          {
            y: () => (isHero ? 0 : window.innerHeight * distanceFactor),
          },
          {
            y: () => window.innerHeight * distanceFactor * -1,
            ease: 'none',
            overwrite: 'auto',
            scrollTrigger: {
              end: 'bottom top',
              invalidateOnRefresh: true,
              scrub: true,
              start: isHero ? 'top top' : 'top bottom',
              trigger: element,
            },
          },
        );

        if (tween.scrollTrigger) {
          parallaxTriggers.push(tween.scrollTrigger);
        }
      });
    };

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    const lenisBridge: LenisScrollBridge = {
      off(_event, callback) {
        scrollListeners.delete(callback);
      },
      on(_event, callback) {
        scrollListeners.add(callback);
      },
      scrollTo(target: HTMLElement | number | string, options) {
        lenis.scrollTo(target, options);
      },
    };

    lenis.on('scroll', handleLenisScroll);
    window.__locoScroll = lenisBridge;
    rafId = window.requestAnimationFrame(raf);

    const timer = window.setTimeout(() => {
      initNativeParallax();
      ScrollTrigger.refresh();
      window.addEventListener('resize', refresh);
    }, 100);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', refresh);
      window.cancelAnimationFrame(rafId);
      parallaxTriggers.forEach((trigger) => trigger.kill());
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      scrollListeners.clear();
      lenis.off('scroll', handleLenisScroll);
      lenis.destroy();
      window.__locoScroll = undefined;
    };
  }, []);
};

export default useLocomotiveScroll;
