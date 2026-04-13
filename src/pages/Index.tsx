import Footer from '@/components/layout/Footer';
import AboutSection from '@/components/landing-page/AboutSection';
import BlogSection from '@/components/landing-page/BlogSection';
import EarlyAdopterSection from '@/components/landing-page/EarlyAdopterSection';
import FeaturedInSection from '@/components/landing-page/FeaturedInSection';
import FeaturedProjectsSection from '@/components/landing-page/FeaturedProjectsSection';
import FutureSection from '@/components/landing-page/FutureSection';
import HeroSection from '@/components/landing-page/HeroSection';
import ParaEffect from '@/components/landing-page/ParaEffect';
import ServicesSection from '@/components/landing-page/ServicesSection';
import SocialLinksSection from '@/components/landing-page/SocialLinksSection';
import SloganSection from '@/components/landing-page/SloganSection';
import ValuesSection from '@/components/landing-page/ValuesSection';
import VideoShowcaseSection from '@/components/landing-page/VideoShowcaseSection';
import WhatIsWealthSection from '@/components/landing-page/WhatIsWealthSection';
import useGsapAnimations from '@/hooks/useGsapAnimations';
import useLocomotiveScroll from '@/hooks/useLocomotiveScroll';

function Index() {
  useLocomotiveScroll();
  useGsapAnimations();

  return (
    <>
      <div
        id='main'
        data-scroll-container
        className='relative overflow-visible bg-brand-black'
      >
        <HeroSection />
        <WhatIsWealthSection />
        <FutureSection />
        <AboutSection />
        <ServicesSection />
        <SloganSection />
        <ValuesSection />
        <FeaturedProjectsSection />
        <VideoShowcaseSection />
        <BlogSection />
        <FeaturedInSection />
        <ParaEffect />
        <EarlyAdopterSection />
        <SocialLinksSection />
        <Footer />
      </div>
    </>
  );
}

export default Index;
