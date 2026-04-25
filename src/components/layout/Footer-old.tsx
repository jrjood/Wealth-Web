import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  ArrowUpRight,
} from 'lucide-react';
import { Logo } from '@/components/Logo';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about-us', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
];

export const Footer = () => {
  return (
    <footer className='relative bg-[#060606] text-white overflow-hidden'>
      {/* Subtle top border */}
      <div className='h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent' />

      <div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16'>
        {/* Main row */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 sm:gap-6'>
          {/* Logo */}
          <Link to='/' className='flex-shrink-0'>
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <Logo className='h-8 sm:h-9 w-auto brightness-0 invert' />
            </motion.div>
          </Link>

          {/* Nav links */}
          <nav className='flex flex-wrap items-center gap-x-6 gap-y-2 sm:gap-x-8'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className='group relative text-[13px] sm:text-sm font-medium text-white/50 hover:text-white transition-colors duration-300'
              >
                {link.label}
                <span className='absolute -bottom-0.5 left-0 h-px w-0 bg-white/40 group-hover:w-full transition-all duration-300' />
              </Link>
            ))}
          </nav>

          {/* Social icons */}
          <div className='flex items-center gap-3'>
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={social.label}
                className='w-9 h-9 rounded-full border border-white/8 flex items-center justify-center text-white/35 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all duration-300'
              >
                <social.icon className='w-4 h-4' />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className='h-px w-full bg-white/6 my-8 sm:my-10' />

        {/* Bottom row */}
        <div className='flex flex-col-reverse sm:flex-row items-center justify-between gap-4'>
          <p className='text-[12px] sm:text-[13px] text-white/30'>
            © {new Date().getFullYear()} Wealth Holding. All rights reserved.
          </p>

          <div className='flex items-center gap-5'>
            <Link
              to='/privacy'
              className='text-[12px] sm:text-[13px] text-white/30 hover:text-white/60 transition-colors duration-300'
            >
              Privacy
            </Link>
            <Link
              to='/terms'
              className='text-[12px] sm:text-[13px] text-white/30 hover:text-white/60 transition-colors duration-300'
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
