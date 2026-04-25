import { ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import AnimatedPillButton from '@/components/ui/AnimatedPillButton';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleScrollToNextSection = () => {
    const target = document.querySelector<HTMLElement>('#page9');

    if (!target) {
      return;
    }

    if (window.__locoScroll?.scrollTo) {
      window.__locoScroll.scrollTo(target, {
        duration: 3.8,
        offset: 0,
      });
      return;
    }

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section
      id='page1'
      data-scroll
      data-scroll-speed='-5'
      className='relative h-[100dvh] w-full bg-primary'
    >
      <div className='bottom-page1 absolute left-[6vw] right-[6vw] top-[19vh] w-auto max-w-[38rem] md:bottom-[21vh] md:left-[9.38%] md:right-auto md:top-auto md:h-[62vh] md:max-w-none md:translate-y-16 md:w-[62vw] lg:w-[56vw]'>
        <h1 className='animated-heading invisible max-w-full text-left text-[clamp(2.15rem,10.2vw,3.35rem)] font-light leading-[1.08] text-brand-cream whitespace-normal md:text-[clamp(2.9rem,5.9vw,7rem)] md:whitespace-nowrap [&_.letter]:inline-block [&_.line]:block [&_.line]:h-[1.12em] [&_.line]:overflow-hidden'>
          Beyond Real Estate.. <br />
          We Build Wealth <br />
          That Lasts
        </h1>

        <div className='bottom-page1-inner mt-5 flex w-full flex-col items-start gap-5 text-brand-cream md:-mt-3 md:h-2/5 md:flex-row md:items-center md:gap-0'>
          <h4 className='hero-subtext opacity-0 max-w-[34rem] text-[1rem] font-light leading-relaxed tracking-wide md:w-[72%] md:max-w-none md:text-xl lg:text-2xl'>
            Innovative developments designed to grow your investment, elevate
            your lifestyle, and create lasting value for generations.
          </h4>

          <div className='learn-more-btn-wrapper opacity-0 flex w-auto justify-start md:w-2/5 md:items-center'>
            <AnimatedPillButton
              label='GET STARTED'
              className='learn-more-btn border-0 px-7 md:px-10'
              labelClassName='text-sm md:text-base'
              onClick={() => navigate('/about-us')}
            />
          </div>
        </div>
      </div>

      <button
        id='scroll-btn'
        type='button'
        className='absolute bottom-8 right-6 z-[1] flex cursor-pointer items-center justify-center bg-transparent p-0 text-brand-cream transition-colors duration-200 hover:text-brand-cream/90 md:bottom-10 md:right-10'
        onClick={handleScrollToNextSection}
      >
        <span className='text-xs font-light uppercase md:text-sm'>Scroll</span>
        <ArrowDown className='ml-1 h-4 w-4 [animation:scroll-arrow-u-d_9s_infinite_ease-in-out] md:h-5 md:w-5' />
      </button>
    </section>
  );
};

export default HeroSection;
