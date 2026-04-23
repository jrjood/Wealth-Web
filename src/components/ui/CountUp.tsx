import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number; // ms
  className?: string;
  trigger?: boolean;
}

export const CountUp = ({ from = 0, to, duration = 1200, className = '', trigger = true }: CountUpProps) => {
  const [value, setValue] = useState(from);
  const raf = useRef<number>();
  const start = useRef<number>();

  useEffect(() => {
    if (!trigger) return;
    let cancelled = false;
    const diff = to - from;
    function step(ts: number) {
      if (!start.current) start.current = ts;
      const progress = Math.min((ts - start.current) / duration, 1);
      setValue(Math.round(from + diff * progress));
      if (progress < 1 && !cancelled) {
        raf.current = requestAnimationFrame(step);
      }
    }
    raf.current = requestAnimationFrame(step);
    return () => {
      cancelled = true;
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [from, to, duration, trigger]);

  return <span className={className}>{value}</span>;
};
