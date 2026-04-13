import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/hooks/useTheme.tsx';
import { ScrollToTop } from '@/components/ScrollToTop';
import { LoadingScreen } from '@/components/LoadingScreen';
import { SplashScreen } from '@/components/SplashScreen';
import MenuButton from '@/components/layout/MenuButton';
import Navigation from '@/components/layout/Navigation';
import OverlayScrollbar from '@/components/layout/OverlayScrollbar';
import SideMenu from '@/components/layout/SideMenu';
import { useState, useEffect } from 'react';
import { emblemImage } from '@/assets';
import Index from './pages/Index';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import ServicesPage from './pages/ServicesPage';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminApplications from './pages/AdminApplications';
import AdminBlogs from './pages/AdminBlogs';
import AdminProjects from './pages/AdminProjects';
import AdminJobs from './pages/AdminJobs';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);
  const [skipInitialHomeLoading, setSkipInitialHomeLoading] = useState(
    location.pathname === '/',
  );
  const shouldShowPageOverlays =
    location.pathname !== '/' || !skipInitialHomeLoading;
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (location.pathname !== '/' && skipInitialHomeLoading) {
      setSkipInitialHomeLoading(false);
    }
  }, [location.pathname, skipInitialHomeLoading]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (location.pathname === '/' && skipInitialHomeLoading) {
      setDisplayLocation(location);
      setIsLoading(false);
      return;
    }

    if (location.pathname !== displayLocation.pathname) {
      setIsLoading(true);

      const timer = window.setTimeout(() => {
        setDisplayLocation(location);
        setIsLoading(false);
      }, 1200);

      return () => window.clearTimeout(timer);
    }
  }, [location, displayLocation.pathname, skipInitialHomeLoading]);

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && shouldShowPageOverlays ? <SplashScreen /> : null}
      <LoadingScreen
        isLoading={!isAdminRoute && shouldShowPageOverlays && isLoading}
      />
      {!isAdminRoute ? (
        <>
          <MenuButton
            isOpen={isMenuOpen}
            onToggle={() => setIsMenuOpen((current) => !current)}
          />
          <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          <Navigation />
        </>
      ) : (
        <header className='sticky top-0 z-30 flex h-20 items-center border-b border-white/10 bg-[hsl(var(--brand-black))] px-4 md:px-8'>
          <a href='/' aria-label='Go to homepage'>
            <img
              src={emblemImage}
              alt='Wealth Holding Logo'
              className='h-11 w-11 object-contain [filter:brightness(0)_saturate(100%)_invert(92%)_sepia(16%)_saturate(328%)_hue-rotate(355deg)_brightness(101%)_contrast(93%)]'
            />
          </a>
        </header>
      )}
      <Routes location={displayLocation}>
        <Route path='/' element={<Index />} />
        <Route path='/about' element={<About />} />
        <Route path='/projects' element={<Projects />} />
        <Route path='/projects/:slug' element={<ProjectDetail />} />
        <Route path='/services' element={<ServicesPage />} />
        <Route path='/careers' element={<Careers />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/blog' element={<Blog />} />
        <Route path='/blog/:slug' element={<BlogPost />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/applications' element={<AdminApplications />} />
        <Route path='/admin/blogs' element={<AdminBlogs />} />
        <Route path='/admin/projects' element={<AdminProjects />} />
        <Route path='/admin/jobs' element={<AdminJobs />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <OverlayScrollbar />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
