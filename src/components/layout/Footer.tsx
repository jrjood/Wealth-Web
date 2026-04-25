import '@/styles/components/Footer.css';
import {
  FaFacebookF as Facebook,
  FaLinkedinIn as Linkedin,
  FaYoutube as Youtube,
  FaInstagram as Instagram,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const quickLinksColumnA = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about-us' },
  { label: 'Projects', to: '/projects' },
  { label: 'Careers', to: '/careers' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

const quickLinksColumnB = [
  { label: 'FAQ', to: '#' },
  { label: 'Privacy policy', to: '#' },
  { label: 'Terms', to: '#' },
];

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
];

const Footer = () => {
  return (
    <footer id='footer'>
      <div className='footer-quicklinks'>
        <div className='footer-coloumn-a'>
          {quickLinksColumnA.map((link) => (
            <Link key={link.label} to={link.to}>
              <h4 className='footer-link'>{link.label}</h4>
            </Link>
          ))}
        </div>

        <div className='footer-coloumn-b'>
          {quickLinksColumnB.map((link) => (
            <a key={link.label} href={link.to}>
              <h4 className='footer-link'>{link.label}</h4>
            </a>
          ))}
        </div>
      </div>

      <div id='cr'>
        <h4>
          &copy; 2026 by{' '}
          <a
            href='https://portfolio-webpage-jrd.vercel.app/'
            target='_blank'
            rel='noopener noreferrer'
          >
            joUX
          </a>
        </h4>
      </div>

      <div id='subscribe-wrapper'>
        <h2>Subscribe</h2>
        <div id='input-email'>
          <input type='text' placeholder='Email' id='subscribe-input' />

          <div className='input-email-arrow-wrapper'>
            <svg
              id='visible-ar-input-email'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              width='20'
              height='20'
              fill='hsl(var(--brand-cream))'
            >
              <path d='M1.99974 13.0001L1.9996 11.0002L18.1715 11.0002L14.2218 7.05044L15.636 5.63623L22 12.0002L15.636 18.3642L14.2218 16.9499L18.1716 13.0002L1.99974 13.0001Z'></path>
            </svg>
            <svg
              id='hidden-ar-input-email'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              width='20'
              height='20'
              fill='hsl(var(--brand-cream))'
            >
              <path d='M1.99974 13.0001L1.9996 11.0002L18.1715 11.0002L14.2218 7.05044L15.636 5.63623L22 12.0002L15.636 18.3642L14.2218 16.9499L18.1716 13.0002L1.99974 13.0001Z'></path>
            </svg>
          </div>
        </div>
      </div>

      <div className='footer-social-links' aria-label='Social links'>
        {socialLinks.map(({ icon: SocialIcon, href, label }) => (
          <a
            key={label}
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={label}
            className='footer-social-link'
          >
            <SocialIcon aria-hidden='true' />
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
