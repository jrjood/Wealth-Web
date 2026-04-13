import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

import { logoWhiteImage } from '@/assets';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show splash screen on every page reload
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode='wait'>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            willChange: 'opacity',
          }}
        >
          {/* Static background glow - no animation for better performance */}
          <div
            style={{
              position: 'absolute',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 70%)',
              opacity: 1,
              pointerEvents: 'none',
            }}
          />

          {/* Logo with reveal animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: 'easeOut',
            }}
            style={{
              willChange: 'opacity',
            }}
          >
            <img
              src={logoWhiteImage}
              alt='Wealth Holding Premium Realty'
              className='h-8 w-auto object-contain'
            />
          </motion.div>

          {/* Animated line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              width: '120px',
              height: '2px',
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
              marginTop: '2rem',
              transformOrigin: 'center',
              willChange: 'transform, opacity',
            }}
          />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.7,
              ease: 'easeOut',
            }}
            style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.875rem',
              fontWeight: 500,
              letterSpacing: '0.15em',
              marginTop: '1.5rem',
              textTransform: 'uppercase',
              willChange: 'opacity',
            }}
          >
            Building Excellence
          </motion.p>

          {/* Bottom progress indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: '3rem',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '200px',
              height: '2px',
              background: 'rgba(255,255,255,0.1)',
              overflow: 'hidden',
              borderRadius: '2px',
            }}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 2,
                delay: 0.2,
                ease: 'linear',
              }}
              style={{
                width: '50%',
                height: '100%',
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                willChange: 'transform',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
