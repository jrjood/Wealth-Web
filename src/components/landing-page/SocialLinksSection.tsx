import '@/styles/sections/SocialLinksSection.css';

type SocialLink = {
  hasBorder?: boolean;
  href: string;
  name: string;
};

const socialLinks: SocialLink[] = [
  { name: 'Facebook', href: 'https://www.facebook.com/WealthHolding' },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/wealth-holding-developments/posts/?feedView=all',
  },
  { name: 'Instagram', href: 'https://www.instagram.com/wealthholding' },
  { name: 'YouTube', href: 'https://www.youtube.com/@wealthholding' },
  {
    name: 'WhatsApp',
    href: 'https://api.whatsapp.com/send/?phone=201121898883&text&type=phone_number&app_absent=0',
    hasBorder: true,
  },
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
