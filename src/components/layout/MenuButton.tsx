import { useRef } from 'react';
import '@/styles/components/MenuButton.css';

type MenuButtonProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const MenuButton = ({ isOpen, onToggle }: MenuButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <button
      id='menu-btn'
      ref={buttonRef}
      type='button'
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      className={isOpen ? 'menu-btn--open' : ''}
      onClick={onToggle}
    >
      <div className='menuline'></div>
      <div className='menuline'></div>
    </button>
  );
};

export default MenuButton;
