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
      className='relative h-screen w-screen bg-primary'
    >
      <div className='bottom-page1 absolute left-[6vw] right-[6vw] top-[18vh] md:bottom-[23.7vh] md:left-[9.38%] md:right-auto md:top-auto md:h-[60vh] md:w-[45vw]'>
        <h1 className='animated-heading overflow-hidden text-left text-[clamp(3.5rem,6.4vw,8rem)] font-light leading-[1.02] text-brand-cream [&_.letter]:inline-block [&_.line]:block [&_.line]:h-[1.09em] [&_.line]:overflow-hidden'>
          Beyond Real <br />
          Estate… We <br />
          Build Wealth <br />
          That Lasts
        </h1>

        <div className='bottom-page1-inner mt-6 flex w-full flex-col items-start gap-8 text-brand-cream md:-mt-3 md:h-2/5 md:flex-row md:items-center md:gap-0'>
          <h4 className='max-w-[28rem] text-base font-light leading-relaxed tracking-wide md:w-3/5 md:max-w-none md:text-lg'>
            Innovative developments designed to grow your investment,{' '}
            <br className='hidden md:block' />
            elevate your lifestyle, and create lasting value for generations.
          </h4>

          <div className='learn-more-btn-wrapper flex w-full justify-start md:w-2/5 md:items-center'>
            <AnimatedPillButton
              label='Learn More'
              className='learn-more-btn border-0 px-10'
              labelClassName='text-sm md:text-base'
              onClick={() => navigate('/about')}
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
