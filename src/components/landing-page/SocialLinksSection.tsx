import '@/styles/sections/SocialLinksSection.css';

type SocialLink = {
  hasBorder?: boolean;
  href: string;
  name: string;
};

const socialLinks: SocialLink[] = [
  { name: 'Facebook', href: 'https://facebook.com' },
  { name: 'LinkedIn', href: 'https://linkedin.com' },
  { name: 'Instagram', href: 'https://instagram.com' },
  { name: 'YouTube', href: 'https://youtube.com' },
  { name: 'WhatsApp', href: 'https://wa.me/15061', hasBorder: true },
];

const SocialLinksSection = () => {
  return (
    <div id='page14'>
      {socialLinks.map((link) => (
        <a
          key={link.name}
          className='page14-inner'
          href={link.href}
          target='_blank'
          rel='noopener noreferrer'
          style={
            link.hasBorder
              ? { borderBottom: '.5px solid hsl(var(--brand-black-700))' }
              : {}
          }
        >
          <h1>{link.name}</h1>
          <i className='ri-arrow-right-up-line'></i>
          <div className='center14'></div>
        </a>
      ))}
    </div>
  );
};

export default SocialLinksSection;
