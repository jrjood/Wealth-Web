import {
  type PointerEvent,
  type WheelEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BadgeCheck } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import ValuesSection from '@/components/landing-page/ValuesSection';
import { Button } from '@/components/ui/button';
import useGsapAnimations from '@/hooks/useGsapAnimations';
import { emblemImage, officeBuildingImage } from '@/assets';
import owner1 from '@/assets/images/owner1.webp';
import owner2 from '@/assets/images/owner2.webp';
import { useSEO } from '@/hooks/useSEO';

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const staggerGroup = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const stats = [
  { value: '2002', label: 'Founded' },
  { value: '20+', label: 'Years' },
  // { value: '4', label: 'Sectors' },
];

const milestones = [
  {
    year: '2002',
    title: 'A Legacy Begins',
    description:
      'Wealth Holding began its journey in construction and development, building on long-term experience, shared values, and a vision for lasting impact.',
  },
  {
    year: 'Growth Phase',
    title: 'Portfolio Expansion',
    description:
      'The company expanded across mixed-use and investment-driven developments, with a growing presence in commercial, administrative, medical, and residential real estate.',
  },
  {
    year: 'New Cairo',
    title: 'Mixed-Use Destinations',
    description:
      'Wealth Holding strengthened its footprint through projects in strategic locations, including developments in New Cairo that support business growth and everyday convenience.',
  },
  {
    year: 'New Capital',
    title: 'Regional Presence',
    description:
      'Its portfolio extended into landmark destinations such as the New Administrative Capital, reflecting a broader vision for smart, high-value urban development.',
  },
  {
    year: '2025',
    title: 'Brand Evolution',
    description:
      'Wealth Holding introduced a renewed brand direction that reflects its ambition, legacy, and investment-led approach to modern real estate development.',
  },
  {
    year: '2026',
    title: 'Citra Residence Launch',
    description:
      'The company launched Citra Residence in New Sheikh Zayed as a major residential development, reinforcing its expansion into integrated communities and long-term value creation.',
  },
];

const leadership = [
  {
    name: 'Mohamed Mamdouh',
    role: 'Owner',
    image: owner1,
    description:
      'Leads Wealth Holding with a long-term development vision focused on strategic growth, quality execution, and lasting investment value.',
  },
  {
    name: 'Eng. Sohir Koriem',
    role: 'Owner',
    image: owner2,
    description:
      'Brings engineering-driven leadership and deep market insight to deliver integrated real estate destinations across prime locations.',
  },
];

const directionItems = [
  {
    title: 'Mission',
    initial: 'M',
    eyebrow: 'What we do',
    label: 'Build with purpose.',
    description:
      'Create meaningful real estate value through smart planning, strong locations, and quality-driven execution.',
  },
  {
    title: 'Vision',
    initial: 'V',
    eyebrow: 'Where we go',
    label: 'Lead with confidence.',
    description:
      'Become a trusted real estate name known for legacy, confidence, and sustainable growth across Egypt.',
  },
];

const DirectionSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className='overflow-hidden bg-background py-14 sm:py-16 lg:py-20'>
      <div className='container-custom'>
        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerGroup}
          className='relative'
        >
          <div className='grid gap-8 border-y border-border py-8 lg:grid-cols-[0.9fr_1.4fr] lg:gap-14 lg:py-12'>
            <motion.div
              variants={fadeUp}
              className='flex flex-col justify-center gap-8'
            >
              <div>
                <h2 className='mt-5 max-w-md font-sans text-4xl font-black leading-[0.98] tracking-tight text-foreground sm:text-5xl lg:text-5xl'>
                  One direction. Two commitments.
                </h2>
              </div>
            </motion.div>

            <div className='relative'>
              <div
                className='absolute left-6 top-0 hidden h-full w-px bg-border lg:block'
                aria-hidden='true'
              />
              <div className='space-y-3'>
                {directionItems.map((item, index) => (
                  <motion.article
                    key={item.title}
                    variants={fadeUp}
                    whileHover={shouldReduceMotion ? undefined : { x: 8 }}
                    className='group relative grid gap-5 py-5 sm:grid-cols-[7rem_1fr] sm:items-start lg:pl-16'
                  >
                    <div className='flex items-center gap-4 sm:block'>
                      <span className='block font-sans text-7xl font-black leading-none text-primary/12 transition-colors duration-300 group-hover:text-primary sm:text-8xl'>
                        {item.initial}
                      </span>
                    </div>
                    <div className='border-t border-border pt-5 sm:border-t-0 sm:pt-0'>
                      <div className='flex flex-wrap items-baseline gap-x-4 gap-y-2'>
                        <h3 className='font-sans text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl'>
                          {item.title}
                        </h3>
                        <span className='text-sm font-semibold text-primary'>
                          {item.label}
                        </span>
                      </div>
                      <p className='mt-4 max-w-2xl text-base leading-8 text-muted-foreground'>
                        {item.description}
                      </p>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const JourneySection = () => {
  const shouldReduceMotion = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const hoverSpeedRef = useRef(0);
  const wheelTargetRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const tick = () => {
      const rail = railRef.current;

      if (rail && !isDraggingRef.current) {
        if (hoverSpeedRef.current !== 0) {
          wheelTargetRef.current = null;
          rail.scrollLeft += hoverSpeedRef.current;
        } else if (wheelTargetRef.current !== null) {
          const distance = wheelTargetRef.current - rail.scrollLeft;

          if (Math.abs(distance) < 0.5) {
            rail.scrollLeft = wheelTargetRef.current;
            wheelTargetRef.current = null;
          } else {
            rail.scrollLeft += distance * 0.14;
          }
        }
      }

      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const stopRailMotion = () => {
    hoverSpeedRef.current = 0;
    wheelTargetRef.current = null;
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const handleRailPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    isDraggingRef.current = true;
    setIsDragging(true);
    hoverSpeedRef.current = 0;
    wheelTargetRef.current = null;
    dragStartXRef.current = event.clientX;
    dragStartScrollRef.current = rail.scrollLeft;
    rail.setPointerCapture(event.pointerId);
  };

  const handleRailPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    if (isDraggingRef.current) {
      const dragDistance = event.clientX - dragStartXRef.current;
      rail.scrollLeft = dragStartScrollRef.current - dragDistance * 0.78;
      return;
    }

    if (event.pointerType !== 'mouse' || shouldReduceMotion) {
      hoverSpeedRef.current = 0;
      return;
    }

    const rect = rail.getBoundingClientRect();
    const edgeSize = Math.min(180, rect.width * 0.28);
    const pointerX = event.clientX - rect.left;

    if (pointerX < edgeSize) {
      hoverSpeedRef.current = -Math.max(
        2,
        ((edgeSize - pointerX) / edgeSize) * 10,
      );
    } else if (pointerX > rect.width - edgeSize) {
      hoverSpeedRef.current = Math.max(
        2,
        ((pointerX - (rect.width - edgeSize)) / edgeSize) * 10,
      );
    } else {
      hoverSpeedRef.current = 0;
    }
  };

  const handleRailWheel = (event: WheelEvent<HTMLDivElement>) => {
    const rail = railRef.current;

    if (!rail || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      return;
    }

    event.preventDefault();

    const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
    const currentTarget = wheelTargetRef.current ?? rail.scrollLeft;
    wheelTargetRef.current = Math.max(
      0,
      Math.min(maxScrollLeft, currentTarget + event.deltaY * 0.62),
    );
  };

  return (
    <section className='relative overflow-hidden bg-[hsl(var(--brand-black-900))] py-14 text-white sm:py-16 lg:py-20'>
      <div
        className='pointer-events-none absolute inset-0 opacity-70'
        aria-hidden='true'
      >
        <div className='absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--brand-black-900))_0%,hsl(var(--brand-black))_100%)]' />
        <div className='absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px]' />
      </div>
      <div className='container-custom relative'>
        <div className='grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end'>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className='max-w-xl'
          >
            <span className='mb-4 block text-sm font-semibold uppercase tracking-[0.22em] text-white/55'>
              Our Journey
            </span>
            <h2 className='font-sans text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl'>
              Milestones That Reflect Our Growth
            </h2>
            <p className='mt-5 max-w-md text-base leading-7 text-white/62'>
              A fast horizontal read of the moments that shaped the company.
            </p>
          </motion.div>
        </div>

        <div className='relative mt-12'>
          <div
            className='pointer-events-none absolute inset-y-0 left-0 z-20 w-10 bg-gradient-to-r from-[hsl(var(--brand-black-900))] via-[hsl(var(--brand-black-900)/0.76)] to-transparent sm:w-14 lg:w-20'
            aria-hidden='true'
          />
          <div
            className='pointer-events-none absolute inset-y-0 right-0 z-20 w-10 bg-gradient-to-l from-[hsl(var(--brand-black-900))] via-[hsl(var(--brand-black-900)/0.76)] to-transparent sm:w-14 lg:w-20'
            aria-hidden='true'
          />

          <div
            ref={railRef}
            onPointerDown={handleRailPointerDown}
            onPointerMove={handleRailPointerMove}
            onPointerUp={stopRailMotion}
            onPointerCancel={stopRailMotion}
            onPointerLeave={() => {
              hoverSpeedRef.current = 0;
            }}
            onWheel={handleRailWheel}
            className={`overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
            }`}
          >
            <div className='relative flex min-w-max snap-x snap-mandatory gap-0 px-1 pb-4 pt-10'>
              <div
                className='absolute left-1 right-1 top-[10.875rem] h-px bg-white/18 sm:top-[11.875rem]'
                aria-hidden='true'
              />
              {milestones.map((milestone, index) => (
                <motion.article
                  key={`${milestone.year}-${milestone.title}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.25, once: true }}
                  transition={{
                    duration: 0.65,
                    delay: index * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : { y: index % 2 === 0 ? -8 : 8 }
                  }
                  className='group relative flex h-[28rem] w-[72vw] max-w-[19rem] snap-start flex-col pr-10 sm:w-[18rem] lg:w-[19rem]'
                >
                  <div className='mb-7 flex h-24 items-end gap-3 sm:h-28'>
                    <span className='max-w-[11rem] font-sans text-4xl font-black leading-[0.95] text-white transition-colors duration-300 group-hover:text-primary sm:max-w-[12.5rem] sm:text-5xl'>
                      {milestone.year}
                    </span>
                    <span className='shrink-0 pb-1 text-xs font-black uppercase tracking-[0.18em] text-white/35'>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className='relative mb-9 h-5'>
                    <div
                      className='absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-primary/40 bg-[hsl(var(--brand-black-900))] transition-all duration-300 group-hover:scale-125 group-hover:border-primary group-hover:bg-primary'
                      aria-hidden='true'
                    />
                    <div className='absolute left-5 top-1/2 h-px w-[calc(100%-1.25rem)] -translate-y-1/2 bg-white/18 transition-colors duration-300 group-hover:bg-primary/70' />
                  </div>
                  <div className='flex min-h-0 flex-1 flex-col border-l border-white/14 pl-5 transition-colors duration-300 group-hover:border-primary/70'>
                    <h3 className='min-h-14 text-xl font-black leading-tight text-white'>
                      {milestone.title}
                    </h3>
                    <p className='mt-4 text-sm leading-7 text-white/58 transition-colors duration-300 group-hover:text-white/78'>
                      {milestone.description}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>

        <div className='mt-4 grid grid-cols-[auto_1fr] items-center gap-4 text-white/50'>
          <span className='text-xs font-semibold uppercase tracking-[0.2em]'>
            Growth rail
          </span>
          <div className='h-px bg-white/14' />
        </div>
      </div>
    </section>
  );
};

const About = () => {
  useGsapAnimations();
  useSEO({
    title: 'About Us | Wealth Holding',
    description:
      'Learn about Wealth Holding, our history, our leadership, and our vision for delivering premium real estate destinations in Egypt.',
  });

  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const heroImageY = useTransform(scrollYProgress, [0, 0.22], ['0%', '10%']);
  const heroTextY = useTransform(scrollYProgress, [0, 0.22], ['0%', '18%']);

  return (
    <Layout>
      {/* Hero Section */}
      <section className='relative flex h-[70vh] items-end overflow-hidden bg-[hsl(var(--brand-black-900))] px-4 pb-8 pt-28 text-white sm:px-6 sm:pb-10 lg:px-8 lg:pb-12'>
        <motion.div
          style={{ y: shouldReduceMotion ? 0 : heroImageY }}
          className='absolute inset-0'
          aria-hidden='true'
        >
          <img
            src={officeBuildingImage}
            alt=''
            className='h-full w-full scale-105 object-cover opacity-55'
          />
          <div className='absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--brand-black))_0%,hsl(var(--brand-black)/0.82)_34%,hsl(var(--brand-black)/0.35)_100%)]' />
          <div className='absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(0deg,hsl(var(--brand-black-900))_0%,transparent_100%)]' />
        </motion.div>

        <div className='container-custom relative z-10'>
          <motion.div
            style={{ y: shouldReduceMotion ? 0 : heroTextY }}
            initial='hidden'
            animate='visible'
            variants={staggerGroup}
            className='max-w-5xl'
          >
            <motion.span
              variants={fadeUp}
              className='mb-4 block text-xs font-semibold uppercase tracking-[0.24em] text-white/65'
            >
              About Us
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className='max-w-3xl font-sans text-4xl font-black leading-[1.03] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl'
            >
              Building Lasting Value
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className='mt-5 max-w-xl text-base leading-7 text-white/78 sm:text-lg md:leading-8'
            >
              Premium real estate in strategic locations.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className='mt-7 flex flex-col gap-3 sm:flex-row'
            >
              <Button asChild size='lg' className='w-full sm:w-auto'>
                <Link to='/projects'>
                  Explore Projects
                  <ArrowRight className='h-4 w-4' />
                </Link>
              </Button>
              <Button
                asChild
                variant='heroOutline'
                size='lg'
                className='w-full border-white/40 text-white hover:border-white hover:bg-white hover:text-[hsl(var(--brand-black))] sm:w-auto'
              >
                <Link to='/contact'>Talk to Sales</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.35 }}
            variants={staggerGroup}
            className='mt-10 grid max-w-4xl grid-cols-1   sm:grid-cols-2'
          >
            {stats.map((item) => (
              <motion.div
                key={item.label}
                variants={fadeUp}
                className='border-white/15 py-5 sm:border-r sm:px-6 last:sm:border-r-0'
              >
                <div className='font-sans text-4xl font-black text-white'>
                  {item.value}
                </div>
                <p className='mt-2 text-sm text-white/62'>{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <DirectionSection />

      <ValuesSection />

      <JourneySection />

      {/* Owners */}
      <section className='relative overflow-hidden bg-[hsl(var(--brand-black-900))] py-16 text-white sm:py-20 lg:py-24'>
        <div
          className='pointer-events-none absolute inset-0 opacity-60'
          aria-hidden='true'
        >
          <div className='absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:64px_64px]' />
          <img
            src={emblemImage}
            alt=''
            className='absolute -right-16 top-10 h-72 w-72 object-contain opacity-[0.035] sm:h-96 sm:w-96 lg:-right-10 lg:top-16'
          />
        </div>

        <div className='container-custom relative'>
          <div className='grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end lg:gap-14'>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className='text-xs font-semibold uppercase tracking-[0.24em] text-white/50'>
                Owners / Leadership
              </span>
              <h2 className='mt-5 max-w-xl font-sans text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl'>
                Led by people who build for the long term.
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.7,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className='max-w-2xl border-t border-white/14 pt-6 lg:ml-auto'
            >
              <p className='text-base leading-8 text-white/62'>
                Wealth Holding is guided by hands-on ownership, strategic market
                judgment, and an execution culture shaped around trust, quality,
                and lasting value.
              </p>
              <div className='mt-6 grid gap-3 sm:grid-cols-3'>
                {[
                  'Strategic vision',
                  'Engineering discipline',
                  'Long-term value',
                ].map((item) => (
                  <div
                    key={item}
                    className='flex items-center gap-2 text-sm font-semibold text-white/72'
                  >
                    <BadgeCheck className='h-4 w-4 text-primary' />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className='mt-12 grid gap-5 lg:grid-cols-2'>
            {leadership.map((item, index) => (
              <motion.article
                key={item.name}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.75,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className='group relative grid min-h-[34rem] overflow-hidden rounded-md border border-white/12 bg-white/[0.035] sm:min-h-[37rem]'
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className='absolute inset-0 h-full w-full object-cover grayscale-[18%] transition duration-700 group-hover:scale-105 group-hover:grayscale-0'
                />
                <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.2)_38%,rgba(0,0,0,0.86)_100%)] transition-opacity duration-300 group-hover:opacity-95' />
                <div className='relative z-10 flex h-full flex-col justify-between p-5 sm:p-7 lg:p-8'>
                  <div className='flex items-start justify-between gap-4'>
                    <span className='rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 backdrop-blur-md'>
                      {item.role}
                    </span>
                  </div>

                  <div className='translate-y-5 transition-transform duration-500 group-hover:translate-y-0'>
                    <div className='mb-5 h-px w-16 bg-primary transition-all duration-500 group-hover:w-28' />
                    <h3 className='font-sans text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl'>
                      {item.name}
                    </h3>
                    <p className='mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base'>
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
