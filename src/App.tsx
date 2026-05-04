import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { ThemeProvider } from '@/hooks/useTheme.tsx';
import { ScrollToTop } from '@/components/ScrollToTop';
import { LoadingScreen } from '@/components/LoadingScreen';
import { SplashScreen } from '@/components/SplashScreen';
import MenuButton from '@/components/layout/MenuButton';
import Navigation from '@/components/layout/Navigation';
import OverlayScrollbar from '@/components/layout/OverlayScrollbar';
import SideMenu from '@/components/layout/SideMenu';
import AnimatedPillButton from '@/components/ui/AnimatedPillButton';
import ProtectedAdminRoute from '@/components/auth/ProtectedAdminRoute';
import useLocomotiveScroll from '@/hooks/useLocomotiveScroll';
import { useState, useEffect, useRef } from 'react';
import {
  aboutOneImage,
  aboutTwoImage,
  backgroundDarkImage,
  brandGuidelinesImage,
  emblemImage,
  officeBuildingImage,
  stampImage,
  textHeroImage,
} from '@/assets';
import Index from './pages/Index';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminApplications from './pages/AdminApplications';
import AdminContactMessages from './pages/AdminContactMessages';
import AdminProjectInquiries from './pages/AdminProjectInquiries';
import AdminBlogs from './pages/AdminBlogs';
import AdminProjects from './pages/AdminProjects';
import AdminJobs from './pages/AdminJobs';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

const queryClient = new QueryClient();

const homePageStaticAssets = [
  aboutOneImage,
  aboutTwoImage,
  backgroundDarkImage,
  brandGuidelinesImage,
  officeBuildingImage,
  stampImage,
  textHeroImage,
];

const waitForWindowLoad = () =>
  new Promise<void>((resolve) => {
    if (document.readyState === 'complete') {
      resolve();
      return;
    }

    window.addEventListener('load', () => resolve(), { once: true });
  });

const waitForFonts = () => {
  if (!('fonts' in document)) {
    return Promise.resolve();
  }

  return document.fonts.ready.then(() => undefined).catch(() => undefined);
};

const withTimeout = (promise: Promise<void>, timeoutMs: number) =>
  new Promise<void>((resolve) => {
    const timeout = window.setTimeout(resolve, timeoutMs);

    promise.finally(() => {
      window.clearTimeout(timeout);
      resolve();
    });
  });

const waitForPageMutationIdle = (root: HTMLElement) =>
  new Promise<void>((resolve) => {
    let idleTimer = window.setTimeout(finish, 650);
    const maxTimer = window.setTimeout(finish, 8000);
    const observer = new MutationObserver(() => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(finish, 650);
    });

    function finish() {
      observer.disconnect();
      window.clearTimeout(idleTimer);
      window.clearTimeout(maxTimer);
      resolve();
    }

    observer.observe(root, {
      childList: true,
      subtree: true,
    });
  });

const waitForImageElement = (image: HTMLImageElement) => {
  if (image.complete) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const finish = () => resolve();

    image.addEventListener('load', finish, { once: true });
    image.addEventListener('error', finish, { once: true });
  });
};

const preloadImageAsset = (src: string) =>
  new Promise<void>((resolve) => {
    const image = new Image();

    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;

    if ('decode' in image) {
      image.decode().then(resolve).catch(resolve);
    }
  });

const waitForVideoElement = (video: HTMLVideoElement) => {
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const finish = () => resolve();

    video.addEventListener('loadeddata', finish, { once: true });
    video.addEventListener('canplay', finish, { once: true });
    video.addEventListener('error', finish, { once: true });
  });
};

const waitForVisiblePageResources = () => {
  const root = document.querySelector<HTMLElement>('#main');

  if (!root) {
    return Promise.resolve();
  }

  const images = Array.from(root.querySelectorAll('img')).filter(
    (image) => image.loading !== 'lazy',
  );
  const videos = Array.from(root.querySelectorAll('video'));

  return withTimeout(
    Promise.all([
      ...images.map((image) => withTimeout(waitForImageElement(image), 12000)),
      ...videos.map((video) => withTimeout(waitForVideoElement(video), 12000)),
    ]).then(() => undefined),
    15000,
  );
};

const usePageResourcesReady = (enabled: boolean, routeKey: string) => {
  const [isReady, setIsReady] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setIsReady(true);
      return;
    }

    let isMounted = true;
    setIsReady(false);

    const settlePageResources = async () => {
      await Promise.all([
        waitForWindowLoad(),
        waitForFonts(),
        Promise.all(homePageStaticAssets.map(preloadImageAsset)),
      ]);

      await new Promise<void>((resolve) =>
        window.requestAnimationFrame(() =>
          window.requestAnimationFrame(() => resolve()),
        ),
      );

      const root = document.querySelector<HTMLElement>('#main');

      if (root) {
        await waitForPageMutationIdle(root);
      }

      await waitForVisiblePageResources();

      if (isMounted) {
        setIsReady(true);
      }
    };

    settlePageResources();

    return () => {
      isMounted = false;
    };
  }, [enabled, routeKey]);

  return isReady;
};

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFloatingTalkToSales, setShowFloatingTalkToSales] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);
  const isAdminRoute = location.pathname.startsWith('/admin');
  const shouldRenderSplash = !isAdminRoute;
  const [isSplashComplete, setIsSplashComplete] = useState(
    () => !shouldRenderSplash,
  );

  const previousShouldRenderSplashRef = useRef(shouldRenderSplash);
  const isContactPage = location.pathname === '/contact';
  const isProjectDetailPage = /^\/projects\/[^/]+$/.test(location.pathname);
  const shouldRenderFloatingTalkToSales =
    !isAdminRoute && !isContactPage && !isProjectDetailPage;
  const arePageResourcesReady = usePageResourcesReady(
    shouldRenderSplash && !isSplashComplete,
    displayLocation.pathname,
  );
  const adminNavItems = [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Projects', to: '/admin/projects' },
    { label: 'Jobs', to: '/admin/jobs' },
    { label: 'Leads', to: '/admin/project-inquiries' },
    { label: 'Messages', to: '/admin/contact-messages' },
    { label: 'Blog', to: '/admin/blogs' },
  ];

  useLocomotiveScroll(displayLocation.pathname, !isAdminRoute);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const previouslyRenderedSplash = previousShouldRenderSplashRef.current;
    previousShouldRenderSplashRef.current = shouldRenderSplash;

    if (!shouldRenderSplash) {
      setIsSplashComplete(true);
      return;
    }

    if (!previouslyRenderedSplash) {
      setIsSplashComplete(false);
    }
  }, [shouldRenderSplash]);

  useEffect(() => {
    const shouldLockScroll =
      isMenuOpen || (shouldRenderSplash && !isSplashComplete);

    if (!shouldLockScroll) {
      window.__locoScroll?.start();
      return;
    }

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousHtmlOverscrollBehavior =
      document.documentElement.style.overscrollBehavior;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyOverscrollBehavior =
      document.body.style.overscrollBehavior;
    const previousBodyTouchAction = document.body.style.touchAction;

    window.__locoScroll?.stop();
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    document.body.style.touchAction = 'none';

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.documentElement.style.overscrollBehavior =
        previousHtmlOverscrollBehavior;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscrollBehavior;
      document.body.style.touchAction = previousBodyTouchAction;
      window.__locoScroll?.start();
    };
  }, [isMenuOpen, isSplashComplete, shouldRenderSplash]);

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
    if (location.pathname !== displayLocation.pathname) {
      setIsLoading(true);

      const timer = window.setTimeout(() => {
        setDisplayLocation(location);
        setIsLoading(false);
      }, 1200);

      return () => window.clearTimeout(timer);
    }
  }, [location, displayLocation.pathname]);

  useEffect(() => {
    if (!shouldRenderFloatingTalkToSales) {
      setShowFloatingTalkToSales(false);
      return;
    }

    const onScroll = () => {
      setShowFloatingTalkToSales(window.scrollY > 220);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [shouldRenderFloatingTalkToSales]);

  return (
    <>
      <ScrollToTop />
      {shouldRenderSplash ? (
        <SplashScreen
          canExit={arePageResourcesReady}
          onFinish={() => setIsSplashComplete(true)}
        />
      ) : null}
      <LoadingScreen isLoading={shouldRenderSplash && isLoading} />
      {!isAdminRoute ? (
        <div
          className={`transition-opacity duration-300 ease-out ${
            isSplashComplete ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          aria-hidden={!isSplashComplete}
        >
          <MenuButton
            isOpen={isMenuOpen}
            onToggle={() => setIsMenuOpen((current) => !current)}
          />
          <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          <Navigation />
          {shouldRenderFloatingTalkToSales ? (
            <div
              className={`fixed bottom-5 right-5 z-[120] transition-all duration-700 ease-in-out ${
                showFloatingTalkToSales
                  ? 'translate-y-0 opacity-100 pointer-events-auto'
                  : 'translate-y-3 opacity-0 pointer-events-none'
              }`}
            >
              <AnimatedPillButton
                id='floating-talk-to-sales'
                label='Talk to Sales'
                tone='brand'
                className='h-11 px-4 !border-0'
                labelClassName='text-[0.7rem] md:text-[0.78rem]'
                onClick={() => navigate('/contact')}
              />
            </div>
          ) : null}
        </div>
      ) : null}
      {isAdminRoute ? (
        <header className='sticky top-0 z-30 border-b border-border/80 bg-[hsl(var(--muted)/0.96)] px-4 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--muted)/0.86)] sm:px-6 lg:px-8'>
          <div className='mx-auto flex min-h-16 w-full max-w-7xl flex-col gap-3 py-3 md:min-h-20 md:flex-row md:items-center md:justify-between md:py-0'>
            <a
              href='/admin/dashboard'
              className='flex min-w-0 items-center gap-3'
              aria-label='Go to admin dashboard'
            >
              <span className='grid h-11 w-11 shrink-0 place-items-center rounded-lg    shadow-sm'>
                <img
                  src={emblemImage}
                  alt='Wealth Holding Logo'
                  className='h-8 w-8 object-contain'
                />
              </span>
              <span className='min-w-0'>
                <span className='block truncate text-sm font-black uppercase tracking-[0.16em] text-foreground'>
                  Wealth Admin
                </span>
                <span className='block truncate text-xs font-semibold text-muted-foreground'>
                  Operations dashboard
                </span>
              </span>
            </a>

            <nav
              className='flex gap-1 overflow-x-auto pb-1 md:pb-0'
              aria-label='Admin navigation'
            >
              {adminNavItems.map((item) => {
                const isActive =
                  location.pathname === item.to ||
                  (item.to !== '/admin/dashboard' &&
                    location.pathname.startsWith(item.to));

                return (
                  <a
                    key={item.to}
                    href={item.to}
                    className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] transition-colors duration-200 ${
                      isActive
                        ? 'bg-[hsl(var(--brand-red-500))] text-white shadow-sm'
                        : 'text-muted-foreground hover:bg-card hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>
        </header>
      ) : null}
      <div
        className={
          shouldRenderSplash && !isSplashComplete
            ? 'pointer-events-none'
            : undefined
        }
        aria-hidden={shouldRenderSplash && !isSplashComplete}
      >
        <Routes location={displayLocation}>
          <Route
            path='/'
            element={
              <Index revealReady={!shouldRenderSplash || isSplashComplete} />
            }
          />
          <Route path='/about-us' element={<About />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/projects/:slug' element={<ProjectDetail />} />
          <Route path='/careers' element={<Careers />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/blog/:slug' element={<BlogPost />} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route
            path='/admin/dashboard'
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path='/admin/applications'
            element={
              <ProtectedAdminRoute>
                <AdminApplications />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path='/admin/contact-messages'
            element={
              <ProtectedAdminRoute>
                <AdminContactMessages />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path='/admin/project-inquiries'
            element={
              <ProtectedAdminRoute>
                <AdminProjectInquiries />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path='/admin/blogs'
            element={
              <ProtectedAdminRoute>
                <AdminBlogs />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path='/admin/projects'
            element={
              <ProtectedAdminRoute>
                <AdminProjects />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path='/admin/jobs'
            element={
              <ProtectedAdminRoute>
                <AdminJobs />
              </ProtectedAdminRoute>
            }
          />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
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
