import '@/styles/components/SideMenu.css';
import { Link } from 'react-router-dom';

type SideMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const menuItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about-us' },
  { label: 'Projects', path: '/projects' },
  { label: 'Careers', path: '/careers' },
  // { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

const socialItems = [
  {
    href: 'https://www.facebook.com/WealthHolding',
    iconClass: 'ri-facebook-fill',
    label: 'Facebook',
  },
  {
    href: 'https://www.linkedin.com/company/wealth-holding-developments/posts/?feedView=all',
    iconClass: 'ri-linkedin-fill',
    label: 'LinkedIn',
  },
  {
    href: 'https://www.instagram.com/wealthholding',
    iconClass: 'ri-instagram-line',
    label: 'Instagram',
  },
  {
    href: 'https://www.youtube.com/@wealthholding',
    iconClass: 'ri-youtube-fill',
    label: 'YouTube',
  },
  {
    href: 'https://api.whatsapp.com/send/?phone=201121898883&text&type=phone_number&app_absent=0',
    iconClass: 'ri-whatsapp-fill',
    label: 'WhatsApp',
  },
];

const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
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
              <Link
                key={item.label}
                to={item.path}
                className='side-menu__link'
                onClick={onClose}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className='side-menu__hotline'>
            <span className='side-menu__hotline-label'>Hotline</span>
            <span className='side-menu__hotline-link'>
              19<span className='side-menu__hotline-link--large'>6</span>40
            </span>
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
