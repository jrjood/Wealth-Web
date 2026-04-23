import type { CSSProperties } from 'react';

import { cn } from '@/lib/utils';

type LogoItem = {
  alt: string;
  href?: string;
  src: string;
};

type LogoStripProps = {
  className?: string;
  direction?: 'left' | 'right';
  gap?: number;
  logoHeight?: number;
  logos: LogoItem[];
  paddingY?: number;
  pauseOnHover?: boolean;
  speedSeconds?: number;
};

const duplicateLogos = (logos: LogoItem[]) => [...logos, ...logos];

const LogoStrip = ({
  logos,
  logoHeight = 72,
  gap = 96,
  paddingY = 20,
  speedSeconds = 34,
  direction = 'right',
  pauseOnHover = true,
  className,
}: LogoStripProps) => {
  const animationName =
    direction === 'right' ? 'logo-strip-scroll-right' : 'logo-strip-scroll-left';

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden py-[var(--logo-strip-padding-y)] [mask-image:linear-gradient(90deg,transparent_0%,black_8%,black_92%,transparent_100%)] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,black_8%,black_92%,transparent_100%)]',
        className,
      )}
      style={
        {
          '--logo-strip-duration': `${speedSeconds}s`,
          '--logo-strip-gap': `${gap}px`,
          '--logo-strip-logo-height': `${logoHeight}px`,
          '--logo-strip-padding-y': `${paddingY}px`,
        } as CSSProperties
      }
    >
      <div
        aria-label='Partner logos'
        className={cn(
          'flex w-max items-center gap-[var(--logo-strip-gap)] will-change-transform',
          pauseOnHover && 'hover:[animation-play-state:paused]',
        )}
        style={{
          animation: `${animationName} var(--logo-strip-duration) linear infinite`,
        }}
      >
        {duplicateLogos(logos).map((logo, index) => {
          const content = (
            <img
              className='block h-[var(--logo-strip-logo-height)] w-auto max-w-[12rem] object-contain object-center opacity-90 brightness-0 invert md:max-w-[18rem]'
              src={logo.src}
              alt={logo.alt}
              loading='lazy'
            />
          );

          return logo.href ? (
            <a
              key={`${logo.src}-${index}`}
              href={logo.href}
              target='_blank'
              rel='noreferrer'
              className='flex h-[var(--logo-strip-logo-height)] flex-none items-center justify-center'
            >
              {content}
            </a>
          ) : (
            <div
              key={`${logo.src}-${index}`}
              className='flex h-[var(--logo-strip-logo-height)] flex-none items-center justify-center'
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LogoStrip;
