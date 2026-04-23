import Footer from '@/components/layout/Footer';
import AboutSection from '@/components/landing-page/AboutSection';
import BlogSection from '@/components/landing-page/BlogSection';
import FeaturedProjectsSection from '@/components/landing-page/FeaturedProjectsSection';
import FutureSection from '@/components/landing-page/FutureSection';
import HeroSection from '@/components/landing-page/HeroSection';
// import ServicesSection from '@/components/landing-page/ServicesSection';
import SloganSection from '@/components/landing-page/SloganSection';
import VideoShowcaseSection from '@/components/landing-page/VideoShowcaseSection';
import WhatIsWealthSection from '@/components/landing-page/WhatIsWealthSection';
import useGsapAnimations from '@/hooks/useGsapAnimations';

function Index() {
  useGsapAnimations();

  return (
    <>
      <div
        id='main'
        data-scroll-container
        className='relative overflow-x-hidden overflow-y-visible bg-brand-black'
      >
        <HeroSection />
        <WhatIsWealthSection />
        <FutureSection />
        <AboutSection />
        {/* <ServicesSection /> */}
        <FeaturedProjectsSection />
        <VideoShowcaseSection />
        <BlogSection />
        <SloganSection />
        <Footer />
      </div>
    </>
  );
}

export default Index;
