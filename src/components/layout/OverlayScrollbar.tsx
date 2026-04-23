import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

type ScrollThumbState = {
  height: number;
  offset: number;
};

type DragState = {
  dragging: boolean;
  pointerId: number | null;
  startOffset: number;
  startPointerY: number;
};

const OverlayScrollbar = () => {
  const [thumb, setThumb] = useState<ScrollThumbState>({
    height: 0,
    offset: 0,
  });
  const [visible, setVisible] = useState(false);
  const hoverStateRef = useRef(false);
  const dragStateRef = useRef<DragState>({
    dragging: false,
    pointerId: null,
    startOffset: 0,
    startPointerY: 0,
  });
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const getMetrics = () => {
      const doc = document.documentElement;
      const viewportHeight = window.innerHeight;
      const scrollHeight = doc.scrollHeight;
      const maxScroll = Math.max(scrollHeight - viewportHeight, 1);
      const trackHeight = viewportHeight - 24;
      const nextHeight = Math.max(
        (viewportHeight / Math.max(scrollHeight, viewportHeight)) * trackHeight,
        44,
      );
      const maxOffset = Math.max(trackHeight - nextHeight, 0);

      return { maxOffset, maxScroll, nextHeight };
    };

    const updateThumb = () => {
      const { maxOffset, maxScroll, nextHeight } = getMetrics();
      const progress = window.scrollY / maxScroll;

      setThumb({
        height: nextHeight,
        offset: progress * maxOffset,
      });
    };

    const showTemporarily = () => {
      setVisible(true);

      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }

      hideTimerRef.current = window.setTimeout(() => {
        if (!dragStateRef.current.dragging && !hoverStateRef.current) {
          setVisible(false);
        }
      }, 900);
    };

    const onScroll = () => {
      updateThumb();
      showTemporarily();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragStateRef.current.dragging) {
        return;
      }

      const { maxOffset, maxScroll } = getMetrics();
      const deltaY = event.clientY - dragStateRef.current.startPointerY;
      const nextOffset = Math.min(
        Math.max(dragStateRef.current.startOffset + deltaY, 0),
        maxOffset,
      );
      const progress = maxOffset > 0 ? nextOffset / maxOffset : 0;

      window.scrollTo({
        behavior: 'auto',
        top: progress * maxScroll,
      });
    };

    const stopDragging = () => {
      if (!dragStateRef.current.dragging) {
        return;
      }

      dragStateRef.current.dragging = false;
      dragStateRef.current.pointerId = null;
      showTemporarily();
    };

    updateThumb();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateThumb);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stopDragging);
    window.addEventListener('pointercancel', stopDragging);

    return () => {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }

      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateThumb);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', stopDragging);
      window.removeEventListener('pointercancel', stopDragging);
    };
  }, []);

  return (
    <div
      aria-hidden='true'
      className={cn(
        'pointer-events-auto fixed right-[6px] top-3 z-[10000] h-[calc(100dvh-24px)] w-4 transition-opacity duration-200',
        visible ? 'opacity-100' : 'opacity-0',
      )}
      onMouseEnter={() => {
        hoverStateRef.current = true;

        if (hideTimerRef.current !== null) {
          window.clearTimeout(hideTimerRef.current);
        }

        setVisible(true);
      }}
      onMouseLeave={() => {
        hoverStateRef.current = false;

        if (!dragStateRef.current.dragging) {
          setVisible(false);
        }
      }}
    >
      <div
        className='ml-auto w-2 cursor-grab rounded-full bg-[hsl(var(--brand-red-500))] shadow-[0_0_0_1px_hsl(var(--brand-red-500)/0.15)] transition-transform duration-75 active:cursor-grabbing'
        style={{
          height: `${thumb.height}px`,
          transform: `translateY(${thumb.offset}px)`,
        }}
        onPointerDown={(event) => {
          dragStateRef.current.dragging = true;
          dragStateRef.current.pointerId = event.pointerId;
          dragStateRef.current.startPointerY = event.clientY;
          dragStateRef.current.startOffset = thumb.offset;
          setVisible(true);
          event.currentTarget.setPointerCapture?.(event.pointerId);
          event.preventDefault();
        }}
      />
    </div>
  );
};

export default OverlayScrollbar;
