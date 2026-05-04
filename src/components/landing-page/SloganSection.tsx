import { useEffect, useRef } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { stampImage, textHeroImage } from '@/assets';
import LightRays from '@/components/LightRays';

gsap.registerPlugin(ScrollTrigger);

const SloganSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stampRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !stampRef.current) {
      return;
    }

    const tween = gsap.to(stampRef.current, {
      ease: 'none',
      rotate: 640,
      scrollTrigger: {
        end: 'bottom top',
        scrub: 1,
        start: 'top bottom',
        trigger: sectionRef.current,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className='relative flex min-h-[56vh] items-center justify-center overflow-hidden bg-[hsl(var(--brand-black-900))] md:min-h-[62vh]'
    >
      <div className='pointer-events-none absolute inset-0 z-[1]'>
        <LightRays
          className='opacity-[0.62]'
          raysOrigin='top-center'
          raysColor='#ffffff'
          raysSpeed={0.55}
          lightSpread={0.95}
          rayLength={1.2}
          fadeDistance={0.85}
          saturation={0.78}
          mouseInfluence={0.06}
          noiseAmount={0.012}
          distortion={0.012}
        />
      </div>

      <div className='relative z-10 mx-auto w-full max-w-[1200px] px-5 text-center'>
        <img
          src={textHeroImage}
          alt='Live the Spotlight'
          className='mx-auto block h-auto w-full max-w-[92%] object-contain md:max-w-[540px] lg:max-w-[640px]'
        />

        <div
          ref={stampRef}
          className='relative z-[15] mx-auto mt-[20px] h-20 w-20 origin-center md:mt-[24px] md:h-[92px] md:w-[92px] lg:mt-8 lg:h-[102px] lg:w-[102px]'
        >
          <img
            src={stampImage}
            alt='Wealth Holding Premium Realty Stamp'
            draggable={false}
            className='h-full w-full object-contain opacity-[0.72] drop-shadow-[0_4px_10px_rgba(0,0,0,0.38)]'
          />
        </div>
      </div>
    </section>
  );
};

export default SloganSection;
