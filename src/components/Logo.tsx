import { useTheme } from '@/hooks/useTheme';
import { useEffect, useState } from 'react';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = 'h-8 w-auto' }: LogoProps) => {
  const { theme } = useTheme();
  const [logoSrc, setLogoSrc] = useState('/logo1-black.png');

  useEffect(() => {
    const newSrc = theme === 'dark' ? '/logo1-white.png' : '/logo1-black.png';
    console.log('Logo theme changed:', theme, 'Using logo:', newSrc);
    setLogoSrc(newSrc);
  }, [theme]);

  return (
    <img
      src={logoSrc}
      alt='Wealth Holding Premium Realty'
      className={`object-contain ${className}`}
    />
  );
};
