import {
  partnerLogo1,
  partnerLogo2,
  partnerLogo3,
  partnerLogo3Webp,
  partnerLogo4,
  partnerLogo5,
  partnerLogo5Webp,
  partnerLogo6,
  partnerLogo7Webp,
} from '@/assets';
import LogoStrip from '@/components/ui/LogoStrip';

const featuredLogos = [
  { alt: 'Partner 1', src: partnerLogo1 },
  { alt: 'Partner 2', src: partnerLogo2 },
  { alt: 'Partner 3', src: partnerLogo3 },
  { alt: 'Partner 4', src: partnerLogo4 },
  { alt: 'Partner 5', src: partnerLogo5 },
  { alt: 'Partner 6', src: partnerLogo6 },
  { alt: 'Partner 7', src: partnerLogo3Webp },
  { alt: 'Partner 8', src: partnerLogo5Webp },
  { alt: 'Partner 9', src: partnerLogo7Webp },
];

const FeaturedInSection = () => {
  return (
    <section
      id='featured-in-section'
      data-scroll
      data-scroll-speed='0'
      className='relative w-screen overflow-hidden bg-brand-black text-white'
    >
      <div className='section-padding pb-10 md:pb-14'>
        <div className='container-custom grid grid-cols-1 gap-8'>
          <div className='ml-0 w-full max-w-[36rem] md:ml-auto'>
            <h2 className='text-5xl font-light leading-none tracking-tight text-brand-cream md:text-6xl lg:text-7xl'>
              Featured In
            </h2>
            <p className='mt-5 max-w-full text-body-lg leading-relaxed text-brand-cream/75 md:mt-7 md:max-w-[32rem]'>
              Featured across real estate, infrastructure, and digital asset
              platforms shaping the next phase of property ownership.
            </p>
          </div>
        </div>

        <LogoStrip
          className='mt-14 md:mt-20 lg:mt-28'
          logos={featuredLogos}
          speedSeconds={34}
          logoHeight={96}
          gap={96}
          paddingY={8}
          direction='right'
          pauseOnHover={false}
        />
      </div>
    </section>
  );
};

export default FeaturedInSection;
