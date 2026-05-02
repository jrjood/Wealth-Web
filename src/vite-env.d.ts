/// <reference types="vite/client" />

interface LenisScrollEvent {
  direction: number;
  progress: number;
  scroll: {
    y: number;
  };
  velocity: number;
}

interface LenisScrollBridge {
  off(event: 'scroll', callback: (data: LenisScrollEvent) => void): void;
  on(event: 'scroll', callback: (data: LenisScrollEvent) => void): void;
  scrollTo(
    target: HTMLElement | number | string,
    options?: {
      duration?: number;
      easing?: (t: number) => number;
      immediate?: boolean;
      lock?: boolean;
      offset?: number;
    },
  ): void;
  start(): void;
  stop(): void;
}

interface Window {
  __locoScroll?: LenisScrollBridge;
}
