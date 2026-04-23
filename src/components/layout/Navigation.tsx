import { emblemImage } from '@/assets';
import { useNavigate } from 'react-router-dom';

import AnimatedPillButton from '@/components/ui/AnimatedPillButton';

const Navigation = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header
      id='nav'
      className='absolute inset-x-0 top-0 z-[11] flex h-20 items-start justify-between px-4 pt-6 md:px-[54px]'
    >
      <img
        id='nav-logo'
        src={emblemImage}
        alt='Wealth Holding Logo'
        className='h-[52px] w-[52px] cursor-pointer object-contain md:h-[58px] md:w-[58px] [filter:brightness(0)_saturate(100%)_invert(92%)_sepia(16%)_saturate(328%)_hue-rotate(355deg)_brightness(101%)_contrast(93%)]'
        onClick={handleLogoClick}
      />

      <div className='absolute right-4 top-6 hidden md:right-[154px] md:block'>
        <AnimatedPillButton
          id='talk-to-sales'
          label='Talk to Sales'
          tone='outline-light'
          className='h-[3.2rem] px-5'
          labelClassName='text-[1vw]'
          onClick={() => navigate('/contact')}
        />
      </div>
    </header>
  );
};

export default Navigation;
