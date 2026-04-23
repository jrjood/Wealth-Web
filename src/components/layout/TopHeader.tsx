import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Facebook, Linkedin, Youtube, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import { SIDENAV_COLLAPSED_WIDTH, SIDENAV_EXPANDED_WIDTH, TOPHEADER_HEIGHT } from '@/lib/constants';

interface TopHeaderProps {
  sidebarWidth: number;
  isMobile: boolean;
}

export const TopHeader = ({ sidebarWidth, isMobile }: TopHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 right-0 z-30 transition-all duration-500',
        isScrolled
          ? 'bg-card/95 backdrop-blur-md shadow-lg'
          : '',
      )}
      style={{
        left: isMobile ? 0 : sidebarWidth,
        height: TOPHEADER_HEIGHT,
        backgroundColor: isScrolled ? undefined : 'transparent',
      }}
    >
      <div className="h-full px-4 md:px-6 lg:px-8 flex items-center justify-between" style={{ paddingLeft: isMobile ? '60px' : undefined }}>
        {/* Left Side - Logo */}
        <Link to="/" className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3"
          >
            <Logo />
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-lg leading-tight text-foreground">
                Wealth Holding
              </span>
              <span className="text-xs text-muted-foreground leading-tight">
                Premium Realty
              </span>
            </div>
          </motion.div>
        </Link>

        {/* Right Side - Hotline & Social Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Hotline */}
          <motion.a
            href="tel:15061"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg',
              'bg-primary/10 hover:bg-primary/20 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            )}
          >
            <Phone className="h-4 w-4 text-primary" />
            <div className="hidden sm:flex flex-col">
              <span className="text-xs text-muted-foreground leading-tight">
                Hotline
              </span>
              <span className="text-sm font-semibold text-foreground leading-tight">
                15061
              </span>
            </div>
            <span className="sm:hidden text-sm font-semibold text-foreground">
              15061
            </span>
          </motion.a>

          {/* Social Icons */}
          <div className="hidden md:flex items-center gap-2">
            <SocialIcon
              href="https://facebook.com"
              icon={Facebook}
              label="Facebook"
            />
            <SocialIcon
              href="https://instagram.com"
              icon={Instagram}
              label="Instagram"
            />
            <SocialIcon
              href="https://linkedin.com"
              icon={Linkedin}
              label="LinkedIn"
            />
            <SocialIcon
              href="https://youtube.com"
              icon={Youtube}
              label="YouTube"
            />
            <SocialIcon
              href="https://wa.me/15061"
              icon={Phone}
              label="WhatsApp"
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

interface SocialIconProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const SocialIcon = ({ href, icon: Icon, label }: SocialIconProps) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.95 }}
    className={cn(
      'p-2 rounded-lg transition-colors',
      'text-muted-foreground hover:text-primary hover:bg-accent',
      'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
    )}
    aria-label={label}
  >
    <Icon className="h-4 w-4" />
  </motion.a>
);
