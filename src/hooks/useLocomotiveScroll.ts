import { useEffect } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const useLocomotiveScroll = (pathname: string, enabled = true) => {

  useEffect(() => {
    if (!enabled) {
      window.__locoScroll = undefined;
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    const scrollListeners = new Set<(data: LenisScrollEvent) => void>();
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
      start() {
        lenis.start();
      },
      stop() {
        lenis.stop();
      },
    };

    lenis.on('scroll', handleLenisScroll);
    window.__locoScroll = lenisBridge;
    rafId = window.requestAnimationFrame(raf);
    window.addEventListener('resize', refresh);

    return () => {
      window.removeEventListener('resize', refresh);
      window.cancelAnimationFrame(rafId);
      scrollListeners.clear();
      lenis.off('scroll', handleLenisScroll);
      lenis.destroy();
      window.__locoScroll = undefined;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const parallaxTriggers: ScrollTrigger[] = [];

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

    // Use an observer to wait for elements to be added to DOM (handles splash screen delay)
    let initialized = false;
    const checkElements = () => {
      const elements = document.querySelectorAll('[data-scroll][data-scroll-speed]');
      if (elements.length > 0 && !initialized) {
        initialized = true;
        setTimeout(() => {
          initNativeParallax();
          ScrollTrigger.refresh();
        }, 100);
      }
    };

    const observer = new MutationObserver(() => {
      checkElements();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    
    // Check initially in case they are already there
    checkElements();

    return () => {
      observer.disconnect();
      parallaxTriggers.forEach((trigger) => trigger.kill());
      parallaxTriggers.length = 0;
    };
  }, [enabled, pathname]);
};

export default useLocomotiveScroll;
