import { useEffect, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

const valuesItems = [
  {
    description:
      'We develop forward-thinking projects that redefine real estate experiences and meet evolving market demands.',
    number: '01',
    title: 'Innovation',
    word: 'Innovation',
  },
  {
    description:
      'We deliver high-standard developments with precision, durability, and attention to every detail.',
    number: '02',
    title: 'Quality',
    word: 'Quality',
  },
  {
    description:
      'We build long-term relationships through transparency, reliability, and consistent delivery.',
    number: '03',
    title: 'Trust',
    word: 'Trust',
  },
  {
    description:
      'We create developments that ensure lasting value, environmental awareness, and future growth for generations.',
    number: '04',
    title: 'Green',
    word: 'Green',
  },
];

const ValuesSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const wordStageRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 70%', 'end 40%'],
  });
  const progressScale = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });

  useEffect(() => {
    const wordStage = wordStageRef.current;

    if (wordStage) {
      wordStage.style.setProperty(
        '--roadmap-word-count',
        `${valuesItems.length}`,
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id='values-section'
      data-scroll
      data-scroll-speed='0'
      className='relative min-h-fit w-screen bg-[hsl(var(--brand-black-800))] px-[6%] py-[12vw] md:px-[9.38%] md:py-[8vw]'
    >
      <div className='relative w-full max-w-full'>
        <h1 className='mb-12 text-[clamp(2rem,3.5vw,3.5vw)] font-light tracking-[0.5px] text-white md:mb-20'>
          Our Values
        </h1>

        <div className='grid grid-cols-1 gap-8 overflow-visible lg:grid-cols-[minmax(0,1fr)_620px] lg:items-start lg:gap-14'>
          <div className='roadmap-timeline relative flex flex-col gap-10 lg:gap-0'>
            <div
              className='absolute bottom-[25vh] left-1.5 top-0 hidden w-px overflow-hidden bg-white/10 lg:block'
              aria-hidden='true'
            >
              <motion.div
                style={{ scaleY: shouldReduceMotion ? 1 : progressScale }}
                className='h-full origin-top bg-[hsl(var(--brand-red-500))]'
              />
            </div>

            {valuesItems.map((item, index) => (
              <div
                key={item.number}
                className='roadmap-item relative z-[1] flex flex-col gap-6 py-8 opacity-100 saturate-100 transition-[opacity,filter,transform] duration-500 md:py-8 lg:min-h-[50vh] lg:justify-center lg:py-16'
                data-step={item.number}
              >
                <div className='roadmap-content relative flex max-w-full flex-col gap-3 pl-10 transition-[opacity,transform] duration-500 md:gap-[0.75rem] lg:max-w-[36rem] lg:pl-14 lg:pt-0'>
                  <div className='flex items-center gap-3'>
                    <div className='roadmap-number text-base font-medium tracking-[1.6px] text-[hsl(var(--brand-gray))]'>
                      {item.number}
                    </div>
                    <div className='inline-flex items-center rounded-md border border-[hsl(var(--brand-red-500)/0.4)] bg-[linear-gradient(140deg,hsl(var(--brand-red-500)/0.28),hsl(var(--brand-black-800)/0.95))] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[hsl(var(--brand-red-100))] shadow-[0_8px_24px_hsl(var(--brand-black)/0.3)] lg:hidden'>
                      {item.word}
                    </div>
                  </div>
                  <h2 className='roadmap-heading max-w-full text-[clamp(1.9rem,3vw,3.4rem)] font-light leading-[1.1] tracking-[0.5px] text-white lg:max-w-[17ch]'>
                    {item.title}
                  </h2>
                  <p className='roadmap-text max-w-full text-[clamp(1.08rem,1.7vw,1.7rem)] font-light leading-[1.7] text-[hsl(var(--brand-gray))] lg:max-w-[26ch]'>
                    {item.description}
                  </p>
                </div>

                {index === valuesItems.length - 1 ? (
                  <div className='hidden h-[35vh] lg:block' />
                ) : null}
              </div>
            ))}
          </div>

          <div className='relative hidden min-h-full lg:block'>
            <div
              ref={wordStageRef}
              className='roadmap-word-stage relative flex min-h-[18rem] items-center justify-center lg:h-[100dvh] lg:pl-4'
            >
              {valuesItems.map((item, index) => (
                <span
                  key={item.number}
                  className={`roadmap-word pointer-events-none absolute text-[clamp(3rem,8vw,6.5rem)] font-semibold uppercase tracking-[0.04em] text-white ${
                    index === 0 ? 'active' : ''
                  }`}
                  data-roadmap-word={item.number}
                >
                  {item.word}
                </span>
              ))}
              <div className='absolute left-1/2 top-[calc(50%+5rem)] flex w-full max-w-[22rem] -translate-x-1/2 items-center gap-4 px-4'>
                <div className='relative h-2 flex-1 overflow-hidden rounded-full bg-white/10'>
                  <motion.div
                    style={{ scaleX: shouldReduceMotion ? 1 : progressScale }}
                    className='h-full origin-left rounded-full bg-[hsl(var(--brand-red-500))]'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
