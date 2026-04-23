import { useEffect, useRef, useState } from 'react';

import { Sparkle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import '@/styles/sections/FutureSection.css';

const WEALTH_HOLDING_FOUNDING_YEAR = 2002;
const currentYear = new Date().getFullYear();
const yearsOfExcellence = Math.max(
  0,
  currentYear - WEALTH_HOLDING_FOUNDING_YEAR,
);

const stats = [
  { label: 'Years of Experience', suffix: '+', value: 20 },
  { label: 'Developed Projects', suffix: '+', value: 3 },
  { label: 'EGP Investment Value', suffix: 'B+', value: 10 },
  { label: 'Prime Locations', suffix: '+', value: 3 },
];

type CounterProps = {
  duration?: number;
  inView: boolean;
  suffix: string;
  target: number;
};

const Counter = ({ target, suffix, duration = 2, inView }: CounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) {
      setCount(0);
      return;
    }

    let start = 0;
    const increment = target / (duration * 60);

    const timer = window.setInterval(() => {
      start += increment;

      if (start >= target) {
        setCount(target);
        window.clearInterval(timer);
        return;
      }

      setCount(Math.floor(start));
    }, 1000 / 60);

    return () => window.clearInterval(timer);
  }, [duration, inView, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

const FutureSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [statsInView, setStatsInView] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const revealItems = section.querySelectorAll<HTMLElement>('[data-reveal]');

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          const revealMode = target.dataset.revealMode;
          const shouldRevealOnce = revealMode === 'once';

          if (entry.isIntersecting) {
            target.classList.add('is-visible');

            if (target.dataset.counterTrigger === 'true') {
              setStatsInView(true);
            }

            if (shouldRevealOnce) {
              revealObserver.unobserve(target);
            }
          }
        });
      },
      {
        rootMargin: '-8% 0px -8% 0px',
        threshold: 0.35,
      },
    );

    const hideObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          const revealMode = target.dataset.revealMode;
          const shouldRevealOnce = revealMode === 'once';

          if (!shouldRevealOnce && !entry.isIntersecting) {
            target.classList.remove('is-visible');
          }
        });
      },
      {
        rootMargin: '0px',
        threshold: 0,
      },
    );

    revealItems.forEach((item, index) => {
      item.style.setProperty('--reveal-delay', `${index * 140}ms`);
      revealObserver.observe(item);

      if (item.dataset.revealMode !== 'once') {
        hideObserver.observe(item);
      }
    });

    return () => {
      revealObserver.disconnect();
      hideObserver.disconnect();
    };
  }, []);

  return (
    <section
      id='page10'
      ref={sectionRef}
      data-scroll
      data-scroll-speed={isMobile ? '0' : '-2'}
      className='future-section'
    >
      <div className='future-bg-gradient-1' />
      <div className='future-bg-gradient-2' />

      <div className='future-container'>
        <div className='future-grid'>
          <div className='future-left-column'>
            <div className='future-icon-wrapper reveal-up' data-reveal>
              <div className='future-icon'>
                <Sparkle strokeWidth={0} aria-hidden='true' />
              </div>
            </div>

            <div className='future-text-content'>
              <h2 className='future-heading reveal-up' data-reveal>
                A Legacy of
                <br />
                Trust &
                <br />
                Excellence
              </h2>

              <p className='future-description reveal-up' data-reveal>
                For over two decades, Wealth Holding has been at the forefront
                <br />
                of real estate development, creating iconic properties.
              </p>
            </div>
          </div>

          <div
            className='future-right-column reveal-up'
            data-counter-trigger='true'
            data-reveal
            data-reveal-mode='once'
          >
            <div className='future-stats-header'>
              <span className='future-stats-label'>OUR IMPACT</span>
              <h3 className='future-stats-title'>Numbers That Define Us</h3>
              <p className='future-stats-description'>
                Two decades of transforming skylines and creating exceptional
                living spaces.
              </p>
            </div>

            <div className='future-stats-grid'>
              {stats.map((stat) => (
                <div key={stat.label} className='future-stat-item'>
                  <div className='future-stat-value'>
                    <Counter
                      target={stat.value}
                      suffix={stat.suffix}
                      inView={statsInView}
                    />
                  </div>
                  <div className='future-stat-label-text'>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FutureSection;
