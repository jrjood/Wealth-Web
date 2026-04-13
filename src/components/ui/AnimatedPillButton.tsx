import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type AnimatedPillButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  alternateLabel?: string;
  tone?: 'light' | 'brand' | 'outline-light';
  innerClassName?: string;
  labelClassName?: string;
  children?: ReactNode;
};

const toneClasses = {
  brand: {
    alternateLabel: 'text-[hsl(var(--brand-red-500))]',
    button: 'bg-[hsl(var(--brand-red-500))] border-transparent',
    overlay: 'bg-[hsl(var(--brand-cream))]',
    primaryLabel: 'text-white',
  },
  light: {
    alternateLabel: 'text-white',
    button: 'bg-[hsl(var(--brand-cream))] border-transparent',
    overlay: 'bg-[hsl(var(--brand-black))]',
    primaryLabel: 'text-[hsl(var(--brand-red-500))]',
  },
  'outline-light': {
    alternateLabel: 'text-[hsl(var(--brand-red-500))]',
    button:
      'border-[hsl(var(--brand-gray)/0.65)] bg-transparent hover:border-[hsl(var(--brand-cream))]',
    overlay: 'bg-[hsl(var(--brand-cream))]',
    primaryLabel: 'text-white',
  },
} as const;

const AnimatedPillButton = ({
  label,
  alternateLabel,
  tone = 'light',
  className,
  innerClassName,
  labelClassName,
  children,
  type = 'button',
  ...props
}: AnimatedPillButtonProps) => {
  const resolvedAlternateLabel = alternateLabel ?? label;
  const toneClassSet = toneClasses[tone];

  return (
    <button
      type={type}
      className={cn(
        'group relative inline-block cursor-pointer appearance-none overflow-hidden rounded-[30px] border px-[33px] py-3 uppercase tracking-[0.5px] transition-[border-color,background-color] duration-500 ease-in-out',
        toneClassSet.button,
        className,
      )}
      {...props}
    >
      <span
        aria-hidden='true'
        className={cn(
            'absolute bottom-0 left-0 z-[2] h-0 w-full transition-[height] duration-500 [transition-delay:200ms] [transition-timing-function:cubic-bezier(0.77,0,0.175,1)] group-hover:h-full',
          toneClassSet.overlay,
        )}
      />

      <span
        className={cn(
          'relative z-[3] block overflow-hidden',
          innerClassName,
        )}
      >
        <span className='relative block'>
          <span
            className={cn(
              'block text-center font-sans font-light transition-transform duration-700 [transition-timing-function:cubic-bezier(0.77,0,0.175,1)] group-hover:translate-y-[150%]',
              toneClassSet.primaryLabel,
              labelClassName,
            )}
          >
            {children ?? label}
          </span>
          <span
            aria-hidden='true'
            className={cn(
                'absolute left-1/2 top-[-150%] block w-full -translate-x-1/2 -translate-y-1/2 text-center font-sans font-light transition-[top] duration-700 [transition-timing-function:cubic-bezier(0.77,0,0.175,1)] group-hover:top-1/2',
              toneClassSet.alternateLabel,
              labelClassName,
            )}
          >
            {resolvedAlternateLabel}
          </span>
        </span>
      </span>
    </button>
  );
};

export default AnimatedPillButton;
