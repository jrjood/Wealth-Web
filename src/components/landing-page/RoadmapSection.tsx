import { useEffect, useRef } from 'react';

const valuesItems = [
  {
    description:
      'We communicate with honesty, act transparently, and always put trust ahead of short-term wins.',
    number: '01',
    title: 'Integrity in Every Decision',
    word: 'Integrity',
  },
  {
    description:
      'We treat every client as a long-term partner and design each experience around real needs.',
    number: '02',
    title: 'Client-Centric Commitment',
    word: 'Commitment',
  },
  {
    description:
      'We embrace innovation to improve how properties are built, managed, and experienced.',
    number: '03',
    title: 'Innovation With Purpose',
    word: 'Innovation',
  },
  {
    description:
      'We build responsibly with long-term value in mind for communities, investors, and the environment.',
    number: '04',
    title: 'Sustainable Excellence',
    word: 'Excellence',
  },
];

const ValuesSection = () => {
  const wordStageRef = useRef<HTMLDivElement | null>(null);

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
            <div className='absolute bottom-[25vh] left-1.5 top-0 hidden w-0.5 bg-[hsl(var(--brand-red-500))] opacity-20 lg:block' />

            {valuesItems.map((item, index) => (
              <div
                key={item.number}
                className='roadmap-item relative z-[1] flex flex-col gap-6 py-8 opacity-100 saturate-100 transition-[opacity,filter,transform] duration-500 md:py-8 lg:min-h-[50vh] lg:justify-center lg:py-16'
                data-step={item.number}
              >
                <div className='roadmap-content relative flex max-w-full flex-col gap-3 pl-10 transition-[opacity,transform] duration-500 md:gap-[0.75rem] lg:max-w-[36rem] lg:pl-14 lg:pt-0'>
                  <div className='roadmap-line absolute left-0 top-[0.4375rem] h-full w-0.5 bg-[linear-gradient(to_bottom,hsl(var(--brand-red-500)/0.3),hsl(var(--brand-red-500)/0.2))] opacity-50 transition-opacity duration-700 lg:h-[24vh]'>
                    <div className='absolute left-[-0.3125rem] top-[-0.3125rem] h-3 w-3 rounded-full bg-[hsl(var(--brand-red-500))]' />
                  </div>
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
              className='roadmap-word-stage relative flex min-h-[18rem] items-center justify-center lg:h-screen lg:pl-4'
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
