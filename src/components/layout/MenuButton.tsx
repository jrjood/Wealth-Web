import { useEffect, useRef, useState } from 'react';
import '@/styles/components/MenuButton.css';

type MenuButtonProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const lightSectionSelectors = ['#page2', '#featured-projects-section'];

const MenuButton = ({ isOpen, onToggle }: MenuButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    let frameId: number | null = null;

    const updateButtonTone = () => {
      const button = buttonRef.current;

      if (!button) {
        return;
      }

      const buttonRect = button.getBoundingClientRect();
      const probeX = buttonRect.left + buttonRect.width / 2;
      const probeY = buttonRect.top + buttonRect.height / 2;

      const shouldUseDarkTone = lightSectionSelectors.some((selector) => {
        const section = document.querySelector<HTMLElement>(selector);

        if (!section) {
          return false;
        }

        const rect = section.getBoundingClientRect();

        return (
          probeX >= rect.left &&
          probeX <= rect.right &&
          probeY >= rect.top &&
          probeY <= rect.bottom
        );
      });

      setIsDark(shouldUseDarkTone);
    };

    const requestUpdate = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(updateButtonTone);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  return (
    <button
      id='menu-btn'
      ref={buttonRef}
      type='button'
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      className={`${isDark ? 'menu-btn--dark' : ''} ${isOpen ? 'menu-btn--open' : ''}`.trim()}
      onClick={onToggle}
    >
      <div className='menuline'></div>
      <div className='menuline'></div>
    </button>
  );
};

export default MenuButton;
