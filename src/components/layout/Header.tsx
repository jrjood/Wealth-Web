import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMenu as Menu } from 'react-icons/hi';
import { AiOutlineClose as X } from 'react-icons/ai';
import { BsSun as Sun, BsMoon as Moon } from 'react-icons/bs';
import {
  FaFacebookF as Facebook,
  FaLinkedinIn as Linkedin,
  FaYoutube as Youtube,
  FaInstagram as Instagram,
} from 'react-icons/fa';
import { BsTelephone as Phone } from 'react-icons/bs';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import { FloatingMenu } from './FloatingMenu';
import './Header.css';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/careers', label: 'Careers' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled ? 'header-scrolled py-3' : 'header-transparent py-1',
        )}
      >
        <div className=' px-12 flex items-center justify-between'>
          {/* Logo */}
          <Link to='/' className='relative z-10'>
            <motion.div
              whileHover={{ scale: 1 }}
              className='flex items-center gap-3'
            >
              <Logo />
            </motion.div>
          </Link>

          {/* Right Side Actions */}
          <div className='flex items-center gap-3 md:gap-4'>
            {/* Hotline */}
            {/*   <a
              href='tel:15061'
              className='hidden sm:flex items-center gap-2 text-foreground hover:text-primary transition-colors'
            >
              <Phone className='h-4 w-4' />
              <span className='text-sm font-medium'>
                <span className='tracking-widest'>HOTLINE:</span>
                19604
              </span>
            </a> */}

            {/* Social Icons */}
            <div className='hidden md:flex items-center gap-2'>
              <a
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-foreground/70 hover:text-primary transition-colors'
                aria-label='Facebook'
              >
                <Facebook className='h-4 w-4' />
              </a>
              <a
                href='https://linkedin.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-foreground/70 hover:text-primary transition-colors'
                aria-label='LinkedIn'
              >
                <Linkedin className='h-4 w-4' />
              </a>
              <a
                href='https://youtube.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-foreground/70 hover:text-primary transition-colors'
                aria-label='YouTube'
              >
                <Youtube className='h-4 w-4' />
              </a>
              <a
                href='https://instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-foreground/70 hover:text-primary transition-colors'
                aria-label='Instagram'
              >
                <Instagram className='h-4 w-4' />
              </a>
            </div>

            {/* Theme Toggle */}
            {/* <Button
              variant='ghost'
              size='icon'
              onClick={toggleTheme}
              className='text-foreground hover:bg-foreground/5 dark:hover:bg-white/10'
              aria-label='Toggle theme'
            >
              <AnimatePresence mode='wait'>
                {theme === 'light' ? (
                  <motion.div
                    key='sun'
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className='h-5 w-5' />
                  </motion.div>
                ) : (
                  <motion.div
                    key='moon'
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className='h-5 w-5' />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button> */}

            {/* Hamburger Menu Button */}
            <Button
              variant='link'
              size='icon'
              className='text-foreground hover:bg-foreground/5 dark:hover:bg-white/10'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label='Toggle menu'
            >
              {isMenuOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Floating Menu - Replaces side drawer */}
      <FloatingMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};
