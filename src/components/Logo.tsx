import { logoBlackImage, logoWhiteImage } from '@/assets';
import { useTheme } from '@/hooks/useTheme';
import { useEffect, useState } from 'react';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = 'h-8 w-auto' }: LogoProps) => {
  const { theme } = useTheme();
  const [logoSrc, setLogoSrc] = useState(logoBlackImage);

  useEffect(() => {
    const newSrc = theme === 'dark' ? logoWhiteImage : logoBlackImage;
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
