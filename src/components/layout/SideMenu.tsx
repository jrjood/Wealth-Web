import '@/styles/components/SideMenu.css';
import { useNavigate } from 'react-router-dom';

type SideMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const menuItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Projects', path: '/projects' },
  { label: 'Careers', path: '/careers' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

const socialItems = [
  {
    href: 'https://facebook.com',
    iconClass: 'ri-facebook-fill',
    label: 'Facebook',
  },
  {
    href: 'https://linkedin.com',
    iconClass: 'ri-linkedin-fill',
    label: 'LinkedIn',
  },
  {
    href: 'https://instagram.com',
    iconClass: 'ri-instagram-line',
    label: 'Instagram',
  },
  {
    href: 'https://youtube.com',
    iconClass: 'ri-youtube-fill',
    label: 'YouTube',
  },
  {
    href: 'https://wa.me/15061',
    iconClass: 'ri-whatsapp-fill',
    label: 'WhatsApp',
  },
];

const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);

    onClose();
  };

  return (
    <div
      className={`side-menu ${isOpen ? 'is-open' : ''}`}
      aria-hidden={!isOpen}
    >
      <button
        type='button'
        className='side-menu__backdrop'
        aria-label='Close menu'
        onClick={onClose}
      />

      <aside className='side-menu__panel' aria-label='Site menu'>
        <div className='side-menu__inner'>
          <nav className='side-menu__nav'>
            {menuItems.map((item) => (
              <button
                key={item.label}
                type='button'
                className='side-menu__link'
                onClick={() => handleNavigate(item.path)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className='side-menu__hotline'>
            <span className='side-menu__hotline-label'>Hotline</span>
            <span className='side-menu__hotline-link'>19640</span>
          </div>

          <div className='side-menu__socials'>
            {socialItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target='_blank'
                rel='noopener noreferrer'
                className='side-menu__social-link'
                aria-label={item.label}
                title={item.label}
              >
                <i className={item.iconClass} aria-hidden='true' />
              </a>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SideMenu;
