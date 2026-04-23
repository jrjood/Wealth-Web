import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AiOutlineHome as Home,
  AiOutlineInfoCircle as Info,
  AiOutlineClose as X,
} from 'react-icons/ai';
import {
  BsBuilding as Building2,
  BsBriefcase as Briefcase,
  BsJournalText as Journal,
} from 'react-icons/bs';
import { HiOutlineUsers as Users } from 'react-icons/hi';
import { MdOutlineEmail as Mail } from 'react-icons/md';
import {
  FaFacebookF as Facebook,
  FaLinkedinIn as Linkedin,
  FaYoutube as Youtube,
  FaInstagram as Instagram,
} from 'react-icons/fa';
import { BsTelephone as Phone } from 'react-icons/bs';
import { cn } from '@/lib/utils';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const menuItems: MenuItem[] = [
  { label: 'Home', path: '/', icon: Home, description: 'Welcome' },
  { label: 'About', path: '/about', icon: Info, description: 'Our Story' },
  {
    label: 'Projects',
    path: '/projects',
    icon: Building2,
    description: 'Portfolio',
  },
  {
    label: 'Services',
    path: '/services',
    icon: Briefcase,
    description: 'What We Do',
  },
  { label: 'Careers', path: '/careers', icon: Users, description: 'Join Us' },
  {
    label: 'Blog',
    path: '/blog',
    icon: Journal,
    description: 'Insights',
  },
  {
    label: 'Contact',
    path: '/contact',
    icon: Mail,
    description: 'Get in Touch',
  },
];

interface FloatingMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FloatingMenu = ({ isOpen, onClose }: FloatingMenuProps) => {
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence mode='wait'>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 bg-black/85 z-[90]'
            onClick={onClose}
            style={{ willChange: 'opacity' }}
          />

          {/* Side Menu Panel */}
          <motion.div
            ref={menuRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className='fixed right-0 top-0 h-full w-full sm:w-[480px] md:w-[520px] lg:w-[600px] bg-black z-[91] overflow-y-auto'
            style={{ willChange: 'transform' }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={cn(
                'absolute top-6 right-6 sm:top-8 sm:right-8 z-20',
                'w-10 h-10 sm:w-12 sm:h-12 rounded-full',
                'border border-white/10 bg-white/5',
                'flex items-center justify-center',
                'hover:bg-white/10 hover:border-white/20',
                'transition-all duration-200 group',
              )}
              aria-label='Close menu'
            >
              <X className='w-5 h-5 sm:w-6 sm:h-6 text-white/60 group-hover:text-white transition-colors duration-200' />
            </button>

            {/* Menu Content */}
            <div className='flex flex-col h-full p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24'>
              {/* Menu Items */}
              <nav className='flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3'>
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link to={item.path} className='group relative'>
                        <div
                          className={cn(
                            'relative flex items-center gap-3 sm:gap-4 lg:gap-6 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl',
                            'border border-white/5',
                            'transition-all duration-200',
                            'hover:bg-white/[0.02] hover:border-white/10',
                            isActive && 'bg-white/[0.03] border-white/15',
                          )}
                          style={{
                            willChange: 'background-color, border-color',
                          }}
                        >
                          {/* Index number */}
                          <div className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white/[0.05] absolute -left-1 sm:-left-2 -top-1 sm:-top-2 select-none transition-colors duration-200 group-hover:text-white/[0.08] pointer-events-none'>
                            {String(index + 1).padStart(2, '0')}
                          </div>

                          {/* Icon */}
                          <div
                            className={cn(
                              'relative z-10 flex items-center justify-center',
                              'w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14 rounded-full',
                              'border transition-all duration-200',
                              isActive
                                ? 'border-white/30 bg-white/5'
                                : 'border-white/10 group-hover:border-white/20',
                            )}
                          >
                            <Icon
                              className={cn(
                                'w-5 h-5 sm:w-5.5 sm:h-5.5 lg:w-6 lg:h-6 transition-colors duration-200',
                                isActive
                                  ? 'text-white'
                                  : 'text-white/60 group-hover:text-white/90',
                              )}
                            />
                          </div>

                          {/* Text Content */}
                          <div className='flex-1 relative z-10 min-w-0'>
                            <h3
                              className={cn(
                                'text-base sm:text-lg lg:text-xl font-semibold mb-0.5 sm:mb-1 transition-colors duration-200 truncate',
                                isActive
                                  ? 'text-white'
                                  : 'text-white/80 group-hover:text-white',
                              )}
                            >
                              {item.label}
                            </h3>
                            <p
                              className={cn(
                                'text-xs sm:text-sm transition-colors duration-200 truncate',
                                isActive
                                  ? 'text-white/50'
                                  : 'text-white/30 group-hover:text-white/40',
                              )}
                            >
                              {item.description}
                            </p>
                          </div>

                          {/* Arrow */}
                          <div
                            className={cn(
                              'relative z-10 transition-all duration-200 flex-shrink-0',
                              isActive
                                ? 'text-white/60'
                                : 'text-white/20 group-hover:text-white/60 group-hover:translate-x-1',
                            )}
                          >
                            <svg
                              className='w-4 h-4 sm:w-5 sm:h-5'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M17 8l4 4m0 0l-4 4m4-4H3'
                              />
                            </svg>
                          </div>

                          {/* Active indicator */}
                          {isActive && (
                            <motion.div
                              layoutId='activeMenuIndicator'
                              className='absolute left-0 top-0 bottom-0 w-1 bg-white/60 rounded-r-full'
                              transition={{
                                type: 'spring',
                                stiffness: 380,
                                damping: 30,
                              }}
                            />
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className='mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/5'
              >
                {/* Social Links */}
                <div className='flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
                  {[
                    {
                      icon: Facebook,
                      href: 'https://facebook.com',
                      label: 'Facebook',
                    },
                    {
                      icon: Linkedin,
                      href: 'https://linkedin.com',
                      label: 'LinkedIn',
                    },
                    {
                      icon: Youtube,
                      href: 'https://youtube.com',
                      label: 'YouTube',
                    },
                    {
                      icon: Instagram,
                      href: 'https://instagram.com',
                      label: 'Instagram',
                    },
                  ].map(({ icon: SocialIcon, href, label }, idx) => (
                    <a
                      key={label}
                      href={href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={cn(
                        'w-10 h-10 sm:w-11 sm:h-11 rounded-full',
                        'border border-white/10 bg-white/5',
                        'hover:bg-white/10 hover:border-white/20',
                        'text-white/60 hover:text-white',
                        'flex items-center justify-center',
                        'transition-all duration-200',
                      )}
                      aria-label={label}
                    >
                      <SocialIcon className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                    </a>
                  ))}
                </div>

                {/* Hotline */}
                <p
                  className={cn(
                    'flex items-center justify-center gap-2 sm:gap-3 w-full p-3 sm:p-4',
                    'rounded-xl',
                    'text-white font-medium',
                    'transition-all duration-200 group',
                  )}
                >
                  <Phone className='w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200' />
                  <span className='text-base sm:text-lg tracking-wider'>
                    19604
                  </span>
                </p>

                {/* Tagline */}
                <p className='text-center text-white/30 text-[10px] sm:text-xs mt-4 sm:mt-6 px-4'>
                  Building value, designed to last
                </p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
