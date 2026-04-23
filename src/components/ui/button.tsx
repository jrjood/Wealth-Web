import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[30px] border border-transparent text-sm font-semibold uppercase tracking-[0.5px] ring-offset-background transition-[border-color,background-color,color,transform,box-shadow] duration-500 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-[hsl(var(--brand-red-500))] text-white hover:bg-[hsl(var(--brand-red-700))] shadow-[0_8px_24px_hsl(var(--brand-black)/0.2)] hover:-translate-y-0.5',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border-[hsl(var(--brand-gray)/0.65)] bg-transparent text-foreground hover:border-[hsl(var(--brand-red-500))] hover:bg-[hsl(var(--brand-red-500))] hover:text-white',
        secondary:
          'bg-[hsl(var(--brand-cream))] text-[hsl(var(--brand-red-500))] hover:bg-white',
        ghost:
          'border-transparent bg-transparent normal-case tracking-normal hover:bg-accent hover:text-accent-foreground rounded-full',
        link: 'normal-case tracking-normal text-primary underline-offset-4 hover:underline',
        hero: 'bg-[hsl(var(--brand-red-500))] text-white hover:bg-[hsl(var(--brand-red-700))] shadow-[0_12px_28px_hsl(var(--brand-black)/0.24)] hover:-translate-y-1 text-base',
        heroOutline:
          'border-[hsl(var(--brand-gray)/0.65)] bg-transparent text-foreground hover:border-[hsl(var(--brand-red-500))] hover:bg-[hsl(var(--brand-red-500))] hover:text-white text-base',
        gold: 'bg-[hsl(var(--brand-gold))] text-white hover:bg-[hsl(var(--brand-yellow))] hover:text-[hsl(var(--brand-black-900))] shadow-[0_8px_24px_hsl(var(--brand-black)/0.2)] hover:-translate-y-0.5',
      },
      size: {
        default: 'h-auto px-6 py-3',
        sm: 'h-auto px-4 py-2 text-xs',
        lg: 'h-auto px-8 py-3.5 text-base',
        xl: 'h-auto px-10 py-4 text-lg',
        icon: 'h-10 w-10 rounded-full p-0 normal-case tracking-normal',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
