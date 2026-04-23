import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Info,
  Building2,
  Briefcase,
  Users,
  Mail,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import {
  SIDENAV_COLLAPSED_WIDTH,
  SIDENAV_EXPANDED_WIDTH,
} from '@/lib/constants';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'About', path: '/about', icon: Info },
  { label: 'Projects', path: '/projects', icon: Building2 },
  { label: 'Services', path: '/services', icon: Briefcase },
  { label: 'Careers', path: '/careers', icon: Users },
  { label: 'Contact', path: '/contact', icon: Mail },
];

interface SideNavProps {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (value: boolean) => void;
  isMobile: boolean;
}

export const SideNav = ({
  isExpanded,
  setIsExpanded,
  isMobileOpen,
  setIsMobileOpen,
  isMobile,
}: SideNavProps) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [closeTimer, setCloseTimer] = useState<NodeJS.Timeout | null>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location, setIsMobileOpen]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, [closeTimer]);

  const handleMouseEnter = () => {
    if (!isMobile) {
      // Cancel any pending close
      if (closeTimer) {
        clearTimeout(closeTimer);
        setCloseTimer(null);
      }
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      // Debounce close by 200ms to prevent flicker
      const timer = setTimeout(() => {
        setIsExpanded(false);
        setCloseTimer(null);
      }, 200);
      setCloseTimer(timer);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const sidebarWidth =
    isExpanded || isMobileOpen
      ? SIDENAV_EXPANDED_WIDTH
      : SIDENAV_COLLAPSED_WIDTH;

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={toggleMobileMenu}
          className={cn(
            'fixed top-4 left-4 z-50 p-2 rounded-lg bg-card shadow-lg',
            'hover:bg-accent transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary',
          )}
          aria-label='Toggle navigation menu'
        >
          <motion.div
            animate={{ rotate: isMobileOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isMobileOpen ? (
              <ChevronLeft className='h-5 w-5' />
            ) : (
              <ChevronRight className='h-5 w-5' />
            )}
          </motion.div>
        </motion.button>
      )}

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className='fixed inset-0 bg-black/50 z-40 md:hidden'
            aria-hidden='true'
          />
        )}
      </AnimatePresence>

      {/* Hover wrapper with buffer zone - prevents flicker at browser edge */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className='fixed left-0 top-0 h-[100dvh] z-40'
        style={{
          width: isMobile
            ? 0
            : isExpanded
              ? SIDENAV_EXPANDED_WIDTH
              : SIDENAV_COLLAPSED_WIDTH + 12, // 12px buffer zone
          pointerEvents: isMobile ? 'none' : 'auto',
        }}
      >
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            width: isMobile
              ? isMobileOpen
                ? SIDENAV_EXPANDED_WIDTH
                : 0
              : sidebarWidth,
            x: isMobile && !isMobileOpen ? -SIDENAV_EXPANDED_WIDTH : 0,
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
          className={cn(
            'h-full bg-card border-r border-border',
            'flex flex-col overflow-hidden shadow-lg',
            isMobile && 'fixed left-0 top-0',
          )}
          style={{
            pointerEvents: 'auto',
          }}
          role='navigation'
          aria-label='Main navigation'
        >
          {/* Logo / Brand Area */}
          <div className='flex items-center justify-center h-16 border-b border-border'>
            <motion.div
              animate={{
                scale: isExpanded || isMobileOpen ? 1 : 0.9,
              }}
              className='flex items-center gap-3 px-4'
            >
              {(isExpanded || isMobileOpen) && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className='font-bold text-lg text-primary whitespace-nowrap'
                >
                  Wealth Holding
                </motion.span>
              )}
              {!isExpanded && !isMobileOpen && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className='w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors'
                  aria-label='Expand menu'
                >
                  <Menu className='h-5 w-5 text-primary' />
                </button>
              )}
            </motion.div>
          </div>

          {/* Navigation Items */}
          <nav className='flex-1 py-6  '>
            <ul className='space-y-2 px-2'>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={cn(
                        'flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                        'group relative',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                      )}
                      aria-label={item.label}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {/* Icon */}
                      <div className='flex-shrink-0 flex items-center justify-center w-6'>
                        <Icon
                          className={cn(
                            'h-5 w-5 transition-transform group-hover:scale-110',
                            isActive && 'scale-110',
                          )}
                        />
                      </div>

                      {/* Label */}
                      <AnimatePresence>
                        {(isExpanded || isMobileOpen) && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                              'font-medium whitespace-nowrap',
                              isActive && 'font-semibold',
                            )}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Tooltip for collapsed state (desktop only) */}
                      {!isMobile && !isExpanded && (
                        <div
                          className={cn(
                            'absolute left-full ml-2 px-3 py-2 rounded-md',
                            'bg-popover text-popover-foreground shadow-lg border border-border',
                            'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
                            'transition-all duration-200 whitespace-nowrap z-50',
                            'pointer-events-none',
                          )}
                          role='tooltip'
                        >
                          {item.label}
                          <div className='absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-popover border-l border-t border-border rotate-45' />
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Theme Toggle at Bottom */}
          <div className='border-t border-border p-2'>
            <button
              onClick={toggleTheme}
              className={cn(
                'flex items-center gap-4 px-3 py-3 rounded-lg w-full transition-all duration-200',
                'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                'group relative',
              )}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {/* Icon */}
              <div className='flex-shrink-0 flex items-center justify-center w-6'>
                {theme === 'light' ? (
                  <Moon className='h-5 w-5 transition-transform group-hover:scale-110' />
                ) : (
                  <Sun className='h-5 w-5 transition-transform group-hover:scale-110' />
                )}
              </div>

              {/* Label */}
              <AnimatePresence>
                {(isExpanded || isMobileOpen) && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className='font-medium whitespace-nowrap'
                  >
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip for collapsed state (desktop only) */}
              {!isMobile && !isExpanded && (
                <div
                  className={cn(
                    'absolute left-full ml-2 px-3 py-2 rounded-md',
                    'bg-popover text-popover-foreground shadow-lg border border-border',
                    'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
                    'transition-all duration-200 whitespace-nowrap z-50',
                    'pointer-events-none',
                  )}
                  role='tooltip'
                >
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  <div className='absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-popover border-l border-t border-border rotate-45' />
                </div>
              )}
            </button>
          </div>
        </motion.aside>
      </div>

      {/* Spacer for main content (desktop only) */}
      {!isMobile && (
        <div
          style={{ width: sidebarWidth }}
          className='transition-all duration-300 ease-in-out'
        />
      )}
    </>
  );
};
