import { aboutOneImage, aboutTwoImage } from '@/assets';
import '@/styles/sections/WhatIsWealthSection.css';

const WhatIsWealthSection = () => {
  return (
    <section id='page9' className='what-is-wealth-section'>
      <div className='what-is-wealth-copy'>
        <div className='what-is-wealth-copy-inner'>
          <span className='what-is-wealth-kicker'>Core Question</span>
          <h1 className='what-is-wealth-title'>
            <span>What is</span>
            <span>Wealth?</span>
          </h1>
          <p className='what-is-wealth-description'>
            Wealth Holding is a real estate developer creating high-value
            investment destinations through innovative design, strategic
            locations, and sustainable growth opportunities.
          </p>
        </div>
      </div>

      <div className='what-is-wealth-media'>
        <div className='what-is-wealth-media-frame'>
          <img
            src={aboutOneImage}
            alt='Modern architecture representing wealth'
            className='what-is-wealth-image-main'
          />
        </div>

        <div
          className='what-is-wealth-media-overlay'
          data-scroll
          data-scroll-speed='-0.5'
        >
          <img
            src={aboutTwoImage}
            alt='Wealth concept overlay'
            className='what-is-wealth-image-overlay'
          />
        </div>

        <div className='what-is-wealth-glow' aria-hidden='true' />
      </div>
    </section>
  );
};

export default WhatIsWealthSection;
