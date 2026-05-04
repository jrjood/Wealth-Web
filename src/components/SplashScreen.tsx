import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { splashLogoLeftImage, splashLogoRightImage } from '@/assets';

interface SplashScreenProps {
  canExit?: boolean;
  onFinish: () => void;
}

const INTRO_DURATION = 0.72;
const LOAD_DURATION = 4.25;
const HOLD_DURATION = 1.6;
const MINIMUM_SPLASH_DURATION_MS = 6500;
const REDUCED_MOTION_MINIMUM_SPLASH_DURATION_MS = 2200;
const COMPLETE_FILL_DURATION_MS = 850;
const EXIT_AFTER_COMPLETE_DELAY_MS = 240;
const TEXT_ENTRY_DELAY = 0.22;
const TEXT_ENTRY_DURATION = 0.74;
const TEXT_EXIT_DURATION = 0.72;
const EMBLEM_ZOOM_DURATION = 1.62;
const CONTENT_EXIT_DURATION = TEXT_EXIT_DURATION + EMBLEM_ZOOM_DURATION;
const CURTAIN_EXIT_DURATION = 0.52;
const SLOGAN_INTERVAL_MS = 1550;
const PREMIUM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const ZOOM_EASE: [number, number, number, number] = [0.2, 0.86, 0.2, 1];
const LOGO_GAP_PX = 12;

const wealthSlogans = [
  'Beyond real estate. Built for legacy.',
  'Live the Spotlight',
  'Building wealth that lasts.',
];

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const image = new Image();

    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;

    if ('decode' in image) {
      image.decode().then(resolve).catch(resolve);
    }
  });

export function SplashScreen({ canExit = true, onFinish }: SplashScreenProps) {
  const reduceMotion = useReducedMotion();
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [isCurtainVisible, setIsCurtainVisible] = useState(true);
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const isReadyToExitRef = useRef(false);
  const [minimumTimeElapsed, setMinimumTimeElapsed] = useState(false);
  const [splashAssetsReady, setSplashAssetsReady] = useState(false);
  const textLogoRef = useRef<HTMLImageElement>(null);
  const [logoCenterShift, setLogoCenterShift] = useState(96);
  const isReadyToExit = canExit && minimumTimeElapsed && splashAssetsReady;

  useEffect(() => {
    isReadyToExitRef.current = isReadyToExit;
  }, [isReadyToExit]);

  useEffect(() => {
    const minimumTimer = window.setTimeout(
      () => setMinimumTimeElapsed(true),
      reduceMotion
        ? REDUCED_MOTION_MINIMUM_SPLASH_DURATION_MS
        : MINIMUM_SPLASH_DURATION_MS,
    );

    return () => window.clearTimeout(minimumTimer);
  }, [reduceMotion]);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      preloadImage(splashLogoLeftImage),
      preloadImage(splashLogoRightImage),
    ]).then(() => {
      if (isMounted) {
        setSplashAssetsReady(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isReadyToExit) {
      return;
    }

    const startProgress = progressRef.current;
    const completeStartTime = window.performance.now();
    let animationFrameId = 0;
    let exitTimer = 0;

    const animateToComplete = () => {
      const elapsedTime = window.performance.now() - completeStartTime;
      const progressRatio = Math.min(1, elapsedTime / COMPLETE_FILL_DURATION_MS);
      const easedProgress = 1 - Math.pow(1 - progressRatio, 3);
      const nextProgress = startProgress + (100 - startProgress) * easedProgress;

      progressRef.current = nextProgress;
      setProgress(nextProgress);

      if (progressRatio < 1) {
        animationFrameId = window.requestAnimationFrame(animateToComplete);
        return;
      }

      progressRef.current = 100;
      setProgress(100);
      exitTimer = window.setTimeout(
        () => setIsContentVisible(false),
        reduceMotion ? 80 : EXIT_AFTER_COMPLETE_DELAY_MS,
      );
    };

    animationFrameId = window.requestAnimationFrame(animateToComplete);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(exitTimer);
    };
  }, [isReadyToExit, reduceMotion]);

  useEffect(() => {
    if (isContentVisible) {
      return;
    }

    const curtainTimer = window.setTimeout(
      () => setIsCurtainVisible(false),
      reduceMotion ? 180 : CONTENT_EXIT_DURATION * 1000 + 120,
    );

    return () => window.clearTimeout(curtainTimer);
  }, [isContentVisible, reduceMotion]);

  useEffect(() => {
    const textLogo = textLogoRef.current;

    if (!textLogo) {
      return;
    }

    const updateLogoShift = () => {
      setLogoCenterShift((textLogo.offsetWidth + LOGO_GAP_PX) / 2);
    };

    updateLogoShift();

    const resizeObserver = new ResizeObserver(updateLogoShift);
    resizeObserver.observe(textLogo);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      const nextProgress = isReadyToExit ? 100 : 92;
      progressRef.current = nextProgress;
      setProgress(nextProgress);
      return;
    }

    const progressStartTime = window.performance.now();
    const progressDelayMs = 480;
    const progressDurationMs = LOAD_DURATION * 1000;

    const updateProgress = () => {
      if (isReadyToExitRef.current) {
        return;
      }

      const elapsedTime =
        window.performance.now() - progressStartTime - progressDelayMs;
      const activeElapsedTime = Math.max(0, elapsedTime);
      const progressRatio = Math.max(
        0,
        Math.min(1, activeElapsedTime / progressDurationMs),
      );
      const easedProgress =
        progressRatio < 1 ? 1 - Math.pow(1 - progressRatio, 2.4) : 1;
      const mainProgress = easedProgress * 88;
      const crawlProgress =
        progressRatio >= 1
          ? Math.min(10.8, (activeElapsedTime - progressDurationMs) / 1000)
          : 0;
      const nextProgress = Math.min(98.8, mainProgress + crawlProgress);

      progressRef.current = nextProgress;
      setProgress(nextProgress);
    };

    let animationFrameId = 0;
    const animateProgress = () => {
      if (isReadyToExitRef.current) {
        return;
      }

      updateProgress();
      animationFrameId = window.requestAnimationFrame(animateProgress);
    };

    animationFrameId = window.requestAnimationFrame(animateProgress);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const sloganTimer = window.setInterval(() => {
      setCurrentSloganIndex((current) => (current + 1) % wealthSlogans.length);
    }, SLOGAN_INTERVAL_MS);

    return () => window.clearInterval(sloganTimer);
  }, [reduceMotion]);

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {isCurtainVisible && (
        <motion.div
          className='fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-brand-black'
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: reduceMotion ? 0.2 : CURTAIN_EXIT_DURATION,
            ease: 'easeOut',
          }}
        >
          <div className='pointer-events-none absolute inset-0 z-0'>
            <motion.div
              className='absolute left-1/2 top-1/2 h-[34rem] w-[34rem] max-w-[82vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary/24 blur-[86px]'
              animate={{
                opacity: reduceMotion ? 0.22 : [0.14, 0.3, 0.18],
                scale: reduceMotion ? 1 : [0.94, 1.05, 0.98],
              }}
              transition={{
                duration: 4.2,
                ease: 'easeInOut',
                repeat: Infinity,
              }}
            />
            <motion.div
              className='absolute left-1/2 top-1/2 h-[16rem] w-[16rem] max-w-[54vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(204,0,10,0.32)_0%,rgba(204,0,10,0.14)_34%,transparent_72%)] blur-2xl'
              initial={{ opacity: 0, scale: 0.78 }}
              animate={{
                opacity: reduceMotion ? 0.38 : [0.28, 0.48, 0.34],
                scale: reduceMotion ? 1 : [0.95, 1.08, 1],
              }}
              transition={{
                delay: reduceMotion ? 0 : 0.1,
                duration: reduceMotion ? 0.1 : 2.8,
                ease: 'easeInOut',
                repeat: Infinity,
              }}
            />
            <motion.div
              className='absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-red-900/35 via-transparent to-transparent'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduceMotion ? 0.1 : 0.9 }}
            />
          </div>

          <AnimatePresence onExitComplete={() => setIsCurtainVisible(false)}>
            {isContentVisible && (
              <motion.div
                className='absolute inset-0 z-10 flex w-full flex-col items-center justify-center px-8'
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  delay: reduceMotion ? 0 : CONTENT_EXIT_DURATION - 0.12,
                  duration: reduceMotion ? 0.15 : 0.12,
                  ease: 'easeOut',
                }}
              >
                <div className='flex flex-col items-center justify-center'>
                  <div className='mb-10 flex flex-col items-center justify-center'>
                    <motion.div
                      className='relative flex origin-center transform-gpu items-center justify-center will-change-transform [backface-visibility:hidden]'
                      initial='hidden'
                      animate='visible'
                      exit='exit'
                      variants={{
                        hidden: {
                          x: reduceMotion ? 0 : logoCenterShift,
                        },
                        visible: {
                          x: 0,
                          transition: {
                            delay: reduceMotion ? 0 : TEXT_ENTRY_DELAY,
                            duration: reduceMotion ? 0.12 : TEXT_ENTRY_DURATION,
                            ease: PREMIUM_EASE,
                          },
                        },
                        exit: {
                          x: reduceMotion ? 0 : logoCenterShift,
                          transition: {
                            duration: reduceMotion ? 0.12 : TEXT_EXIT_DURATION,
                            ease: PREMIUM_EASE,
                          },
                        },
                      }}
                    >
                      <motion.div
                        aria-hidden='true'
                        className='absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary/28 blur-3xl will-change-[transform,opacity] md:h-44 md:w-44'
                        variants={{
                          hidden: {
                            opacity: 0,
                            scale: reduceMotion ? 1 : 0.78,
                          },
                          visible: {
                            opacity: reduceMotion ? 0.32 : [0.28, 0.48, 0.34],
                            scale: reduceMotion ? 1 : [0.92, 1.08, 1],
                            transition: {
                              delay: reduceMotion ? 0 : 0.08,
                              duration: reduceMotion ? 0.15 : 2.6,
                              ease: 'easeInOut',
                              repeat: Infinity,
                              repeatType: 'mirror',
                            },
                          },
                          exit: {
                            opacity: 0,
                            scale: reduceMotion ? 1 : 4.2,
                            transition: {
                              delay: reduceMotion ? 0 : TEXT_EXIT_DURATION,
                              duration: reduceMotion
                                ? 0.15
                                : EMBLEM_ZOOM_DURATION,
                              ease: ZOOM_EASE,
                            },
                          },
                        }}
                      />
                      <motion.div
                        aria-hidden='true'
                        className='absolute left-1/2 top-1/2 z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(204,0,10,0.95)_0%,rgba(204,0,10,0.72)_36%,rgba(204,0,10,0.18)_62%,transparent_74%)] opacity-0 will-change-[transform,opacity] md:h-32 md:w-32'
                        variants={{
                          hidden: {
                            opacity: 0,
                            scale: 0.4,
                          },
                          visible: {
                            opacity: 0,
                            scale: 0.4,
                          },
                          exit: {
                            opacity: reduceMotion ? 0 : [0, 0.72, 0.94, 0],
                            scale: reduceMotion ? 1 : 18,
                            transition: {
                              opacity: {
                                delay: reduceMotion
                                  ? 0
                                  : TEXT_EXIT_DURATION + 0.14,
                                duration: reduceMotion
                                  ? 0.12
                                  : EMBLEM_ZOOM_DURATION - 0.14,
                                ease: 'easeOut',
                              },
                              scale: {
                                delay: reduceMotion ? 0 : TEXT_EXIT_DURATION,
                                duration: reduceMotion
                                  ? 0.12
                                  : EMBLEM_ZOOM_DURATION,
                                ease: ZOOM_EASE,
                              },
                            },
                          },
                        }}
                      />
                      <motion.img
                        src={splashLogoLeftImage}
                        alt='Wealth Holding emblem'
                        loading='eager'
                        decoding='sync'
                        fetchPriority='high'
                        className='relative z-20 h-20 w-auto shrink-0 transform-gpu object-contain will-change-[transform,opacity] [backface-visibility:hidden] [transform:translateZ(0)] md:h-28 lg:h-32'
                        variants={{
                          hidden: {
                            opacity: 0,
                            scale: reduceMotion ? 1 : 0.84,
                          },
                          visible: {
                            opacity: 1,
                            scale: reduceMotion ? 1 : [1, 1.012, 1],
                            transition: {
                              opacity: {
                                delay: reduceMotion ? 0 : 0.08,
                                duration: reduceMotion ? 0.12 : 0.42,
                                ease: 'easeOut',
                              },
                              scale: {
                                delay: reduceMotion ? 0 : 0.92,
                                duration: reduceMotion ? 0.15 : 2.4,
                                ease: 'easeInOut',
                                repeat: Infinity,
                                repeatType: 'mirror',
                              },
                            },
                          },
                          exit: {
                            opacity: 0,
                            scale: reduceMotion ? 1 : 2.85,
                            transition: {
                              opacity: {
                                delay: reduceMotion
                                  ? 0
                                  : TEXT_EXIT_DURATION + 0.86,
                                duration: reduceMotion ? 0.15 : 0.5,
                                ease: 'easeOut',
                              },
                              scale: {
                                delay: reduceMotion ? 0 : TEXT_EXIT_DURATION,
                                duration: reduceMotion
                                  ? 0.15
                                  : EMBLEM_ZOOM_DURATION,
                                ease: ZOOM_EASE,
                              },
                            },
                          },
                        }}
                      />
                      <motion.div
                        className='relative z-10 overflow-hidden pr-1'
                        style={{ marginLeft: LOGO_GAP_PX }}
                      >
                        <motion.img
                          ref={textLogoRef}
                          src={splashLogoRightImage}
                          alt='Wealth Holding'
                          loading='eager'
                          decoding='sync'
                          fetchPriority='high'
                          className='h-16 w-auto transform-gpu object-contain drop-shadow-[0_0_24px_rgba(204,0,10,0.28)] will-change-[transform,opacity] [backface-visibility:hidden] md:h-24 lg:h-28'
                          variants={{
                            hidden: {
                              opacity: 0,
                              x: reduceMotion ? 0 : -(logoCenterShift * 2),
                              scale: reduceMotion ? 1 : 0.985,
                            },
                            visible: {
                              opacity: 1,
                              x: 0,
                              scale: 1,
                              transition: {
                                delay: reduceMotion ? 0 : TEXT_ENTRY_DELAY,
                                duration: reduceMotion
                                  ? 0.15
                                  : TEXT_ENTRY_DURATION,
                                ease: PREMIUM_EASE,
                              },
                            },
                            exit: {
                              opacity: 0,
                              x: reduceMotion ? 0 : -(logoCenterShift * 2),
                              scale: reduceMotion ? 1 : 0.985,
                              transition: {
                                duration: reduceMotion
                                  ? 0.12
                                  : TEXT_EXIT_DURATION,
                                ease: PREMIUM_EASE,
                              },
                            },
                          }}
                        />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      className='mt-7 w-[min(32rem,78vw)]'
                      initial={{ opacity: 1, y: 0 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0,
                          ease: 'easeOut',
                        },
                      }}
                      exit={{
                        opacity: 0,
                        y: reduceMotion ? 0 : 8,
                        transition: {
                          duration: reduceMotion ? 0.12 : 0.22,
                          ease: 'easeOut',
                        },
                      }}
                    >
                      <div
                        className='relative h-3 w-full overflow-visible rounded-full'
                        role='progressbar'
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(progress)}
                        aria-label='Loading page resources'
                      >
                        <div className='absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-brand-cream/20 to-transparent' />
                        <div className='absolute inset-x-4 top-1/2 h-7 -translate-y-1/2 rounded-full bg-brand-primary/14 blur-xl' />
                        <div className='absolute inset-0 rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.025))] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_34px_rgba(0,0,0,0.28)]' />
                        <div className='absolute inset-[3px] overflow-hidden rounded-full bg-black/70'>
                          <div className='absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:18px_100%] opacity-30' />
                        </div>
                        <motion.div
                          className='absolute inset-[3px] origin-left overflow-hidden rounded-full bg-gradient-to-r from-brand-red-900 via-brand-primary to-brand-cream shadow-[0_0_18px_rgba(204,0,10,0.72)] will-change-transform'
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: progress / 100 }}
                          transition={{
                            duration: reduceMotion ? 0.1 : 0.16,
                            ease: 'linear',
                          }}
                        >
                          {!reduceMotion ? (
                            <motion.span
                              aria-hidden='true'
                              className='absolute inset-y-0 left-[-45%] w-[42%] -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent mix-blend-screen'
                              animate={{ x: ['0%', '360%'] }}
                              transition={{
                                duration: 1.45,
                                ease: 'easeInOut',
                                repeat: Infinity,
                              }}
                            />
                          ) : null}
                        </motion.div>
                        <motion.span
                          aria-hidden='true'
                          className='absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-brand-cream/70 bg-brand-white shadow-[0_0_18px_rgba(238,237,218,0.72),0_0_26px_rgba(204,0,10,0.52)]'
                          style={{ left: `calc(${progress}% - 0.5rem)` }}
                          animate={{
                            opacity: progress > 2 ? 1 : 0,
                            scale: reduceMotion ? 1 : [0.92, 1.08, 0.96],
                          }}
                          transition={{
                            duration: reduceMotion ? 0.1 : 1.2,
                            ease: 'easeInOut',
                            repeat: reduceMotion ? 0 : Infinity,
                          }}
                        />
                      </div>
                      <div className='mt-3 flex items-center justify-center gap-2'>
                        {[0, 1, 2].map((index) => (
                          <motion.span
                            key={index}
                            className='h-1.5 w-1.5 rounded-full bg-brand-cream/70 shadow-[0_0_10px_rgba(238,237,218,0.45)]'
                            animate={{
                              opacity: reduceMotion ? 0.7 : [0.24, 1, 0.24],
                              scale: reduceMotion ? 1 : [0.86, 1.18, 0.86],
                            }}
                            transition={{
                              delay: index * 0.16,
                              duration: 1.05,
                              ease: 'easeInOut',
                              repeat: Infinity,
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>

                <div className='absolute bottom-8 left-6 right-6 flex justify-center overflow-hidden sm:bottom-10'>
                  <AnimatePresence mode='wait' initial={false}>
                    <motion.p
                      key={currentSloganIndex}
                      className='relative max-w-[min(46rem,92vw)] overflow-hidden text-center text-sm font-black uppercase leading-relaxed tracking-[0.2em] text-brand-cream/90 drop-shadow-[0_0_22px_rgba(238,237,218,0.22)] sm:text-base md:text-xl'
                      initial={{
                        filter: reduceMotion ? 'blur(0px)' : 'blur(10px)',
                        opacity: 0,
                        scale: reduceMotion ? 1 : 0.96,
                        y: reduceMotion ? 0 : 14,
                      }}
                      animate={{
                        filter: 'blur(0px)',
                        opacity: 1,
                        scale: 1,
                        y: 0,
                      }}
                      exit={{
                        filter: reduceMotion ? 'blur(0px)' : 'blur(8px)',
                        opacity: 0,
                        scale: reduceMotion ? 1 : 1.02,
                        y: reduceMotion ? 0 : -14,
                      }}
                      transition={{
                        duration: reduceMotion ? 0.12 : 0.7,
                        ease: PREMIUM_EASE,
                      }}
                    >
                      <span className='relative z-10'>
                        {wealthSlogans[currentSloganIndex]}
                      </span>
                      <motion.span
                        aria-hidden='true'
                        className='absolute inset-y-0 left-[-35%] z-20 w-[34%] -skew-x-12 bg-gradient-to-r from-transparent via-white/55 to-transparent mix-blend-screen'
                        initial={{ x: '-120%' }}
                        animate={{ x: reduceMotion ? '-120%' : '430%' }}
                        transition={{
                          delay: 0.08,
                          duration: 0.95,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    </motion.p>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
