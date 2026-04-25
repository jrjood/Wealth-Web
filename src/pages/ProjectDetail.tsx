import { type FormEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  Building2,
  Check,
  Download,
  Expand,
  MapPin,
  PlayCircle,
  Star,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import AnimatedPillButton from '@/components/ui/AnimatedPillButton';
import { Input } from '@/components/ui/input';
import { resolveMediaUrl } from '@/lib/media';
import { getYouTubeEmbedUrl, isDirectVideoUrl } from '@/lib/video';
import { useToast } from '@/hooks/use-toast';
import { useSEO } from '@/hooks/useSEO';
import { ImageLightbox } from '@/components/projects/ImageLightbox';
import { PaymentPlanCard } from '@/components/projects/PaymentPlanCard';
import { ProjectGallery } from '@/components/projects/ProjectGallery';
import { ProjectLocationSection } from '@/components/projects/ProjectLocationSection';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

gsap.registerPlugin(ScrollTrigger);

const revealViewport = { once: true, amount: 0.18 };

const revealUp: Variants = {
  hidden: { opacity: 0, y: 42, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.78, ease: [0.22, 1, 0.36, 1] },
  },
};

const revealLeft: Variants = {
  hidden: { opacity: 0, x: -34, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
  },
};

const revealRight: Variants = {
  hidden: { opacity: 0, x: 34, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
  },
};

const revealGroup: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const revealItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
  },
};

interface GalleryImage {
  id: string;
  imageUrl: string;
  title?: string | null;
  sortOrder?: number;
}

interface NearbyLocation {
  id: string;
  name: string;
  distance: string;
  sortOrder?: number;
}

interface PaymentPlan {
  id: string;
  downPayment: string;
  installments: string;
  startingPrice: string;
}

interface Project {
  id: string;
  title: string;
  location: string;
  type: string;
  status: string;
  description: string;
  imageUrl: string | null;
  featured: boolean;
  details: string | null;
  amenities: string | null;
  specifications: string | null;
  projectLogoUrl: string | null;
  masterPlanImage: string | null;
  locationImage: string | null;
  locationMapUrl: string | null;
  videoUrl: string | null;
  brochureUrl: string | null;
  galleryImages: GalleryImage[];
  nearbyLocations: NearbyLocation[];
  paymentPlan: PaymentPlan | null;
}

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const detailsSectionRef = useRef<HTMLElement | null>(null);
  const detailsContentRef = useRef<HTMLDivElement | null>(null);
  const leadFormPinRef = useRef<HTMLDivElement | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [masterPlanOpen, setMasterPlanOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const { toast } = useToast();

  useSEO({
    title: project ? `${project.title} | Wealth Holding` : 'Project Detail | Wealth Holding',
    description: project?.description || 'Explore premium real estate projects by Wealth Holding.'
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`${API_URL}/api/projects/${slug}`);
        if (!response.ok) throw new Error('Project not found');
        const data = await response.json();
        setProject(data);
      } catch (fetchError) {
        console.error('Error fetching project:', fetchError);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProject();
    }
  }, [slug]);

  const masterPlanUrl = useMemo(
    () => resolveMediaUrl(project?.masterPlanImage, API_URL),
    [project],
  );

  const locationImageUrl = useMemo(
    () => resolveMediaUrl(project?.locationImage, API_URL),
    [project],
  );

  const galleryImages = useMemo(
    () =>
      (project?.galleryImages || []).map((image) => ({
        ...image,
        imageUrl: resolveMediaUrl(image.imageUrl, API_URL),
      })),
    [project],
  );

  const heroImageUrl = useMemo(
    () => resolveMediaUrl(project?.imageUrl, API_URL),
    [project],
  );

  const projectLogoUrl = useMemo(
    () => resolveMediaUrl(project?.projectLogoUrl, API_URL),
    [project],
  );

  const amenitiesList = useMemo(
    () =>
      project?.amenities
        ? project.amenities
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
    [project],
  );

  const specsList = useMemo(
    () =>
      project?.specifications
        ? project.specifications
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
    [project],
  );

  const youtubeEmbedUrl = useMemo(
    () => getYouTubeEmbedUrl(project?.videoUrl),
    [project],
  );
  const directVideoUrl = useMemo(
    () =>
      isDirectVideoUrl(project?.videoUrl)
        ? resolveMediaUrl(project?.videoUrl, API_URL)
        : null,
    [project],
  );
  const brochureUrl = useMemo(
    () => resolveMediaUrl(project?.brochureUrl, API_URL),
    [project],
  );

  useLayoutEffect(() => {
    if (
      !project ||
      !detailsSectionRef.current ||
      !detailsContentRef.current ||
      !leadFormPinRef.current
    ) {
      return;
    }

    const section = detailsSectionRef.current;
    const content = detailsContentRef.current;
    const leadForm = leadFormPinRef.current;
    const media = window.matchMedia('(min-width: 1024px)');

    const context = gsap.context(() => {
      ScrollTrigger.matchMedia({
        '(min-width: 1024px)': () => {
          const trigger = ScrollTrigger.create({
            trigger: section,
            start: 'top top+=112',
            endTrigger: content,
            end: 'bottom bottom-=32',
            pin: leadForm,
            pinSpacing: false,
            invalidateOnRefresh: true,
          });

          return () => {
            trigger.kill();
          };
        },
      });
    }, section);

    const refresh = () => {
      ScrollTrigger.refresh();
    };

    const refreshAfterLayoutSettles = () => {
      window.requestAnimationFrame(refresh);
    };

    const images = Array.from(section.querySelectorAll<HTMLImageElement>('img'));

    images.forEach((image) => {
      if (image.complete) {
        return;
      }

      image.addEventListener('load', refreshAfterLayoutSettles, { once: true });
      image.addEventListener('error', refreshAfterLayoutSettles, { once: true });
    });

    window.addEventListener('resize', refresh);
    media.addEventListener('change', refresh);
    refreshAfterLayoutSettles();

    return () => {
      images.forEach((image) => {
        image.removeEventListener('load', refreshAfterLayoutSettles);
        image.removeEventListener('error', refreshAfterLayoutSettles);
      });
      window.removeEventListener('resize', refresh);
      media.removeEventListener('change', refresh);
      context.revert();
    };
  }, [project]);

  const scrollToLeadForm = () => {
    document
      .getElementById('project-lead-form')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleLeadSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!project) return;

    setLeadSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/project-inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: leadForm.name.trim(),
          email: leadForm.email.trim(),
          phone: leadForm.phone.trim(),
          projectId: project.id,
          message: `Project inquiry for ${project.title}.`,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || 'Failed to send inquiry.');
      }

      toast({
        title: 'Inquiry sent',
        description: 'Our sales team will contact you shortly.',
      });
      setLeadForm({
        name: '',
        phone: '',
        email: '',
      });
    } catch (submitError) {
      toast({
        title: 'Inquiry not sent',
        description:
          submitError instanceof Error
            ? submitError.message
            : 'Please try again in a moment.',
        variant: 'destructive',
      });
    } finally {
      setLeadSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className='min-h-screen flex items-center justify-center'>
          <p className='text-muted-foreground text-lg'>Loading project...</p>
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <h1 className='heading-display text-foreground mb-4'>
              Project Not Found
            </h1>
            <p className='text-muted-foreground mb-6'>
              The project you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link to='/projects'>
              <Button>Back to Projects</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const projectWhatsappMessage = encodeURIComponent(
    `Hello Wealth Holding, I am interested in ${project.title}. Please contact me with more details.${
      typeof window !== 'undefined' ? `\n${window.location.href}` : ''
    }`,
  );
  const projectWhatsappLink = `https://wa.me/201090000000?text=${projectWhatsappMessage}`;

  return (
    <Layout>
      <div className='relative'>
        <section className='relative flex min-h-screen items-center justify-center overflow-hidden'>
          <div className='absolute inset-0'>
            {directVideoUrl ? (
              <video
                className='h-full w-full object-cover'
                src={directVideoUrl}
                autoPlay
                muted
                loop
                playsInline
                poster={heroImageUrl || undefined}
              />
            ) : heroImageUrl ? (
              <img
                src={heroImageUrl}
                alt={project.title}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='h-full w-full bg-[radial-gradient(circle_at_top,_rgba(193,154,107,0.34),_transparent_50%),linear-gradient(180deg,_#201811,_#0f0a07)]' />
            )}
            <div className='absolute inset-0 bg-black/50' />
            <div className='absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/70' />
          </div>

          <div className='container-custom relative z-10 flex min-h-screen max-w-[96rem] min-w-0 flex-col justify-between pb-10 pt-28 md:pt-32'>
            <motion.div
              initial='hidden'
              animate='visible'
              variants={revealLeft}
            >
              <Link
                to='/projects'
                className='inline-flex w-fit items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/75 transition-colors hover:text-white'
              >
                <ArrowLeft className='h-4 w-4' />
                Back to Projects
              </Link>
            </motion.div>

            <motion.div
              initial='hidden'
              animate='visible'
              variants={revealGroup}
              className='mx-auto flex w-full max-w-4xl min-w-0 flex-1 flex-col items-center justify-center text-center'
            >
              {projectLogoUrl ? (
                <motion.img
                  variants={revealUp}
                  src={projectLogoUrl}
                  alt={`${project.title} logo`}
                  className='mb-10 max-h-44 w-auto max-w-[min(76vw,620px)] object-contain drop-shadow-[0_18px_42px_rgba(0,0,0,0.55)]'
                />
              ) : (
                <motion.h1
                  variants={revealUp}
                  className='mb-10 max-w-4xl break-words text-4xl font-light uppercase tracking-[0.12em] text-white drop-shadow-[0_14px_30px_rgba(0,0,0,0.55)] sm:text-5xl md:text-7xl md:tracking-[0.18em]'
                >
                  {project.title}
                </motion.h1>
              )}

              <motion.div variants={revealItem}>
                <AnimatedPillButton
                  label={leadSubmitting ? 'Sending...' : 'Inquire Now'}
                  tone='outline-light'
                  className='w-full max-w-64 border-white/70 bg-transparent sm:w-auto'
                  labelClassName='text-sm md:text-base'
                  onClick={scrollToLeadForm}
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial='hidden'
              animate='visible'
              variants={revealGroup}
              className='mx-auto grid w-full max-w-4xl min-w-0 grid-cols-1 gap-5 text-white sm:grid-cols-3'
            >
              {[
                { icon: MapPin, value: project.location },
                { icon: Building2, value: project.type },
                { icon: Star, value: project.status },
              ].map((item) => (
                <motion.div
                  key={item.value}
                  variants={revealItem}
                  className='flex flex-col items-center gap-2 text-center'
                >
                  <item.icon className='h-6 w-6 text-white/85' />
                  <span className='text-base font-semibold tracking-wide'>
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section
          ref={detailsSectionRef}
          className='section-padding bg-[hsl(var(--brand-black-700))]'
        >
          <div className='container-custom max-w-[96rem] min-w-0'>
            <div className='grid min-w-0 gap-10 lg:items-start lg:grid-cols-[minmax(0,1fr)_minmax(18rem,320px)] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(19rem,340px)]'>
              <div
                ref={detailsContentRef}
                className='min-w-0 space-y-10 lg:space-y-14'
              >
                <motion.div
                  initial='hidden'
                  whileInView='visible'
                  viewport={revealViewport}
                  variants={revealUp}
                >
                  <section className='relative overflow-hidden px-4 py-10 sm:px-8 sm:py-12 lg:px-10'>
                    <div className='flex max-w-5xl min-w-0 flex-col gap-8'>
                      <div>
                        <h2 className='break-words text-4xl font-black uppercase tracking-[0.08em] text-[hsl(var(--brand-gold))] sm:text-5xl md:text-7xl'>
                          Overview
                        </h2>
                      </div>

                      <div className='border-t border-[hsl(var(--brand-gold)/0.55)] pt-8'>
                        <p className='whitespace-pre-line text-lg leading-8 text-white/82'>
                          {project.description}
                        </p>
                        {project.details ? (
                          <p className='mt-6 whitespace-pre-line text-base leading-8 text-white/62'>
                            {project.details}
                          </p>
                        ) : null}
                        {brochureUrl ? (
                          <Button variant='outline' className='mt-9' asChild>
                            <a
                              href={brochureUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              download
                            >
                              <Download className='h-4 w-4' />
                              Download Brochure
                            </a>
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </section>
                </motion.div>

                <motion.div
                  initial='hidden'
                  whileInView='visible'
                  viewport={revealViewport}
                  variants={revealUp}
                >
                  <PaymentPlanCard paymentPlan={project.paymentPlan} />
                </motion.div>

                <motion.div
                  initial='hidden'
                  whileInView='visible'
                  viewport={revealViewport}
                  variants={revealUp}
                >
                  <ProjectLocationSection
                    imageUrl={locationImageUrl}
                    locations={project.nearbyLocations}
                    directionsUrl={project.locationMapUrl}
                  />
                </motion.div>

                {masterPlanUrl ? (
                  <motion.section
                    initial='hidden'
                    whileInView='visible'
                    viewport={revealViewport}
                    variants={revealGroup}
                    className='relative min-w-0 overflow-hidden bg-[hsl(var(--brand-black-800))] px-4 py-10 sm:px-8 lg:px-10'
                  >
                    <div className='grid min-w-0 gap-8 lg:grid-cols-[6rem_minmax(0,1fr)] lg:items-stretch xl:grid-cols-[7rem_minmax(0,1fr)]'>
                      <motion.div
                        variants={revealLeft}
                        className='flex items-center justify-center lg:min-h-[30rem]'
                      >
                        <h2 className='break-words text-center text-4xl font-black uppercase tracking-[0.08em] text-[hsl(var(--brand-gold))] sm:text-5xl lg:[writing-mode:vertical-rl] lg:rotate-180 lg:text-6xl xl:text-7xl'>
                          Masterplan
                        </h2>
                      </motion.div>

                      <motion.button
                        variants={revealRight}
                        type='button'
                        onClick={() => setMasterPlanOpen(true)}
                        className='group relative block aspect-[4/3] w-full min-w-0 overflow-hidden bg-[hsl(var(--brand-black-700))] shadow-[0_22px_70px_rgba(0,0,0,0.42)] sm:aspect-[16/10] lg:min-h-[30rem]'
                        aria-label={`Preview ${project.title} master plan`}
                      >
                        <img
                          src={masterPlanUrl}
                          alt={`${project.title} master plan`}
                          className='absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]'
                        />
                        <span className='absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm'>
                          <Expand className='h-4 w-4' />
                        </span>
                      </motion.button>
                    </div>
                  </motion.section>
                ) : null}

                <motion.div
                  initial='hidden'
                  whileInView='visible'
                  viewport={revealViewport}
                  variants={revealUp}
                >
                  <ProjectGallery images={galleryImages} />
                </motion.div>

                {youtubeEmbedUrl ? (
                  <motion.section
                    initial='hidden'
                    whileInView='visible'
                    viewport={revealViewport}
                    variants={revealGroup}
                    className='space-y-6'
                  >
                    <motion.div
                      variants={revealItem}
                      className='flex items-center gap-3'
                    >
                      <div className='flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <PlayCircle className='h-5 w-5' />
                      </div>
                      <div>
                        <p className='text-xs font-semibold uppercase tracking-[0.24em] text-primary'>
                          Walkthrough
                        </p>
                        <h2 className='heading-card text-foreground'>Video</h2>
                      </div>
                    </motion.div>

                    <motion.div
                      variants={revealItem}
                      className='overflow-hidden rounded-3xl border border-border/60 bg-card'
                    >
                      <div className='aspect-video w-full'>
                        <iframe
                          src={youtubeEmbedUrl}
                          title={`${project.title} video`}
                          className='h-full w-full'
                          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                          allowFullScreen
                        />
                      </div>
                    </motion.div>
                  </motion.section>
                ) : null}

                {specsList.length > 0 || amenitiesList.length > 0 ? (
                  <motion.div
                    initial='hidden'
                    whileInView='visible'
                    viewport={revealViewport}
                    variants={revealUp}
                  >
                    <section className='relative min-w-0 overflow-hidden px-4 py-10 sm:px-8 sm:py-12 lg:px-10'>
                      <div className='mb-10 grid min-w-0 gap-4 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] md:items-end'>
                        <div className='min-w-0'>
                          <p className='mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/55'>
                            Project Details
                          </p>
                          <h2 className='break-words text-3xl font-black uppercase tracking-[0.08em] text-[hsl(var(--brand-gold))] sm:text-5xl md:text-6xl'>
                            Specs & Amenities
                          </h2>
                        </div>
                        <p className='max-w-2xl text-sm leading-7 text-white/62 md:justify-self-end'>
                          A quick look at the practical details and everyday
                          comforts that shape the project experience.
                        </p>
                      </div>

                      <motion.div
                        initial='hidden'
                        whileInView='visible'
                        viewport={revealViewport}
                        variants={revealGroup}
                        className='grid min-w-0 gap-10 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]'
                      >
                        {specsList.length > 0 ? (
                          <motion.section
                            variants={revealItem}
                            className='min-w-0 border-t border-[hsl(var(--brand-gold)/0.55)] pt-6'
                          >
                            <div className='mb-7 flex items-center justify-between gap-4'>
                              <h3 className='text-2xl font-medium text-white'>
                                Specifications
                              </h3>
                            </div>

                            <motion.div
                              variants={revealGroup}
                              className='grid gap-0'
                            >
                              {specsList.map((spec, index) => (
                                <motion.div
                                  key={`${spec}-${index}`}
                                  variants={revealItem}
                                  className='grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-3 border-b border-white/12 py-5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-4'
                                >
                                  <span className='pt-0.5 text-sm font-semibold tabular-nums text-[hsl(var(--brand-gold))]'>
                                    {String(index + 1).padStart(2, '0')}
                                  </span>
                                  <p className='min-w-0 break-words text-base leading-7 text-white/85'>
                                    {spec}
                                  </p>
                                </motion.div>
                              ))}
                            </motion.div>
                          </motion.section>
                        ) : null}

                        {amenitiesList.length > 0 ? (
                          <motion.section
                            variants={revealItem}
                            className='relative min-w-0 border-t border-white/18 pt-6'
                          >
                            <div className='relative mb-7 flex items-center justify-between gap-4'>
                              <h3 className='text-2xl font-medium text-white'>
                                Amenities
                              </h3>
                            </div>

                            <motion.div
                              variants={revealGroup}
                              className='relative grid min-w-0 gap-3 sm:grid-cols-2'
                            >
                              {amenitiesList.map((amenity, index) => (
                                <motion.div
                                  key={`${amenity}-${index}`}
                                  variants={revealItem}
                                  className='group flex min-h-20 min-w-0 items-center gap-3 border border-white/12 bg-white/[0.03] p-4 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[hsl(var(--brand-gold)/0.65)] hover:bg-white/[0.06] hover:shadow-[0_1.25rem_2.75rem_rgba(0,0,0,0.24)] sm:gap-4'
                                >
                                  <span className='flex h-9 w-9 shrink-0 items-center justify-center border border-[hsl(var(--brand-gold)/0.58)] text-[hsl(var(--brand-gold))] transition-all duration-500 ease-out group-hover:scale-110 group-hover:bg-[hsl(var(--brand-gold))] group-hover:text-[hsl(var(--brand-black))]'>
                                    <Check className='h-4 w-4 transition-transform duration-500 ease-out group-hover:rotate-12' />
                                  </span>
                                  <span className='min-w-0 break-words text-sm font-medium leading-6 text-white/82 transition-all duration-500 ease-out group-hover:translate-x-1 group-hover:text-white'>
                                    {amenity}
                                  </span>
                                </motion.div>
                              ))}
                            </motion.div>
                          </motion.section>
                        ) : null}
                      </motion.div>
                    </section>
                  </motion.div>
                ) : null}
              </div>

              <div
                id='project-lead-form'
                className='min-w-0 lg:col-span-1 lg:self-start'
              >
                <div ref={leadFormPinRef} className='lg:h-fit'>
                  <motion.div
                    initial='hidden'
                    whileInView='visible'
                    viewport={revealViewport}
                    variants={revealRight}
                    className='rounded-lg border border-border/60 bg-card p-5 xl:p-6'
                  >
                  <h3 className='heading-card text-foreground mb-2'>
                    Inquire About {project.title}
                  </h3>
                  <p className='mb-3 text-xs text-muted-foreground'>
                    Leave your details and our sales team will get in touch.
                  </p>
                  <form onSubmit={handleLeadSubmit} className='space-y-3'>
                    <Input
                      id='lead-name'
                      placeholder='Your Name'
                      value={leadForm.name}
                      onChange={(event) =>
                        setLeadForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      required
                      autoComplete='name'
                    />
                    <Input
                      id='lead-phone'
                      placeholder='Phone Number'
                      value={leadForm.phone}
                      onChange={(event) =>
                        setLeadForm((current) => ({
                          ...current,
                          phone: event.target.value,
                        }))
                      }
                      required
                      autoComplete='tel'
                    />
                    <Input
                      id='lead-email'
                      type='email'
                      placeholder='Email Address'
                      value={leadForm.email}
                      onChange={(event) =>
                        setLeadForm((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                      required
                      autoComplete='email'
                    />
                    <AnimatedPillButton
                      type='submit'
                      label={leadSubmitting ? 'Sending...' : 'Submit Inquiry'}
                      tone='brand'
                      className='w-full border-0 !border-none disabled:cursor-not-allowed disabled:opacity-50'
                      labelClassName='text-sm'
                      disabled={leadSubmitting}
                    />
                  </form>
                  <div className='mt-3 flex items-end justify-between gap-3 border-t border-border pt-3'>
                    <div>
                      <p className='mb-1 text-xs text-muted-foreground'>
                        Sales Hotline
                      </p>
                      <a
                        href='tel:19640'
                        className='text-base font-semibold text-foreground transition-colors hover:text-primary'
                      >
                        19640
                      </a>
                    </div>
                    <a
                      href={projectWhatsappLink}
                      target='_blank'
                      rel='noopener noreferrer'
                      aria-label={`Chat with Wealth Holding on WhatsApp about ${project.title}`}
                      className='inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-colors hover:bg-green-700'
                    >
                      <FaWhatsapp className='h-5 w-5' />
                    </a>
                  </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {masterPlanUrl ? (
        <ImageLightbox
          open={masterPlanOpen}
          onOpenChange={setMasterPlanOpen}
          imageUrl={masterPlanUrl}
          alt={`${project.title} master plan`}
        />
      ) : null}
    </Layout>
  );
};

export default ProjectDetail;
