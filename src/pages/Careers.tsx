import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Clock,
  FileText,
  MapPin,
  Send,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AnimatedPillButton from '@/components/ui/AnimatedPillButton';
import { useToast } from '@/hooks/use-toast';
import { useSEO } from '@/hooks/useSEO';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const MAX_CV_SIZE = 20 * 1024 * 1024;
const ALLOWED_CV_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ALLOWED_CV_EXTENSIONS = ['.pdf', '.doc', '.docx'];

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

const benefits = [
  'Competitive compensation',
  'Medical coverage',
  'Performance bonuses',
  'Professional development',
  'Cross-functional project exposure',
  'Wellness and team programs',
];

const journeySteps = [
  'Apply with your CV',
  'HR screening',
  'Team interview',
  'Offer and onboarding',
];

const getDescriptionBullets = (description: string) =>
  description
    .split('.')
    .map((sentence) => sentence.trim())
    .filter(Boolean);

const Careers = () => {
  useSEO({
    title: 'Careers | Wealth Holding',
    description:
      'Build your career with a company shaping real estate destinations. View open positions and submit your application.',
  });

  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState('general');
  const [activeDepartment, setActiveDepartment] = useState('All');
  const [openings, setOpenings] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraggingCv, setIsDraggingCv] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    jobId: 'general',
    message: '',
  });

  const departments = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(
          openings
            .map((job) => job.department.trim())
            .filter((department) => department.length > 0),
        ),
      ),
    ],
    [openings],
  );

  const filteredOpenings = useMemo(
    () =>
      activeDepartment === 'All'
        ? openings
        : openings.filter((job) => job.department === activeDepartment),
    [activeDepartment, openings],
  );

  const selectedJob = openings.find((job) => job.id === selectedJobId);

  const fetchJobs = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/jobs`);
      const data = await response.json();
      setOpenings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load job openings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void fetchJobs();
  }, [fetchJobs]);

  const scrollToApplicationForm = () => {
    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleApplyNow = (job: Job) => {
    setExpandedJobId(job.id);
    setSelectedJobId(job.id);
    setFormData((current) => ({ ...current, jobId: job.id }));
    scrollToApplicationForm();
  };

  const handleJobSelect = (value: string) => {
    setSelectedJobId(value);
    setFormData((current) => ({ ...current, jobId: value }));
  };

  const validateCvFile = (file: File) => {
    const extensionIndex = file.name.lastIndexOf('.');
    const extension =
      extensionIndex >= 0 ? file.name.slice(extensionIndex).toLowerCase() : '';
    const typeAllowed = ALLOWED_CV_TYPES.includes(file.type);
    const extensionAllowed = ALLOWED_CV_EXTENSIONS.includes(extension);

    if (file.size > MAX_CV_SIZE) {
      toast({
        title: 'CV too large',
        description: 'Please upload a file smaller than 20 MB.',
        variant: 'destructive',
      });
      return false;
    }

    if (!typeAllowed && !extensionAllowed) {
      toast({
        title: 'Unsupported file type',
        description: 'Please upload a PDF, DOC, or DOCX file.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleFile = (file: File | null) => {
    if (!file) return;

    if (!validateCvFile(file)) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setCvFile(null);
      return;
    }

    setCvFile(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0] ?? null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingCv(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingCv(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingCv(false);
    handleFile(event.dataTransfer.files?.[0] ?? null);
  };

  const clearCvFile = () => {
    setCvFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!cvFile) {
      toast({
        title: 'CV required',
        description: 'Please attach your CV before submitting the application.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const job = openings.find((opening) => opening.id === formData.jobId);
      const applicationData = new FormData();
      applicationData.append('name', formData.name.trim());
      applicationData.append('email', formData.email.trim());
      applicationData.append('phone', formData.phone.trim());
      applicationData.append('jobId', formData.jobId);
      applicationData.append('jobTitle', job?.title ?? 'General Application');
      applicationData.append('message', formData.message.trim());
      applicationData.append('cv', cvFile);

      const response = await fetch(`${API_URL}/api/job-applications`, {
        method: 'POST',
        body: applicationData,
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error || 'Failed to submit application');
      }

      toast({
        title: 'Application Submitted',
        description: payload?.emailSent
          ? 'Your application has been saved and sent to HR.'
          : 'Your application has been saved. Email delivery will work once SMTP is configured.',
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        jobId: 'general',
        message: '',
      });
      clearCvFile();
      setSelectedJobId('general');
    } catch (error) {
      toast({
        title: 'Application not sent',
        description:
          error instanceof Error
            ? error.message
            : 'Please try again in a moment.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <main className='min-w-0 bg-[hsl(var(--brand-black))] text-white'>
        <section className='relative overflow-hidden bg-[hsl(var(--brand-black-800))]'>
          <img
            src='https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=82'
            alt='Modern workplace interior'
            className='absolute inset-0 h-full w-full object-cover opacity-42'
          />
          <div className='absolute inset-0 bg-black/72' />
          <div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/56 to-[hsl(var(--brand-black-800))]' />

          <div className='container-custom relative z-10 flex min-h-[55vh] max-w-[96rem] flex-col justify-end pb-8 pt-28 sm:min-h-[58vh] sm:pb-10 lg:pt-32'>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className='max-w-4xl'
            >
              <p className='mb-4 inline-flex items-center gap-3 border border-white/16 bg-white/[0.06] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/72 backdrop-blur-md'>
                <BriefcaseBusiness className='h-4 w-4 text-[hsl(var(--brand-gold))]' />
                Careers at Wealth Holding
              </p>
              <h1 className='max-w-4xl break-words text-4xl font-bold uppercase leading-[0.96] tracking-[0.06em] text-white sm:text-5xl md:text-6xl'>
                Careers that move real estate forward.
              </h1>
              <p className='mt-5 max-w-2xl text-sm leading-7 text-white/66 sm:text-base'>
                Explore open roles, choose the best fit, and submit your profile
                directly to our HR team.
              </p>

              <div className='mt-7 flex flex-col gap-3 sm:flex-row'>
                <button
                  type='button'
                  onClick={scrollToApplicationForm}
                  className='inline-flex cursor-pointer items-center justify-center gap-3 border border-[hsl(var(--brand-gold))] bg-[hsl(var(--brand-cream))] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[hsl(var(--brand-black))] transition-colors duration-200 hover:bg-[hsl(var(--brand-yellow))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-gold))] focus:ring-offset-2 focus:ring-offset-black'
                >
                  Apply Now
                  <ArrowRight className='h-4 w-4' />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <section
          id='open-positions'
          className='bg-[hsl(var(--brand-black-800))] py-12 sm:py-16 lg:py-20'
        >
          <div className='container-custom max-w-[96rem]'>
            <div className='mb-8 grid gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-end'>
              <div>
                <p className='mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/48'>
                  <Users className='h-4 w-4 text-[hsl(var(--brand-gold))]' />
                  Open Positions
                </p>
                <h2 className='break-words text-3xl font-bold uppercase tracking-[0.08em] text-[hsl(var(--brand-gold))] sm:text-4xl md:text-5xl'>
                  Find your next role.
                </h2>
              </div>

              <div className='flex min-w-0 flex-wrap gap-2 lg:justify-end'>
                {departments.map((department) => (
                  <button
                    key={department}
                    type='button'
                    onClick={() => setActiveDepartment(department)}
                    className={`cursor-pointer border px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-gold))] focus:ring-offset-2 focus:ring-offset-[hsl(var(--brand-black-800))] ${
                      activeDepartment === department
                        ? 'border-[hsl(var(--brand-gold))] bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-black))]'
                        : 'border-white/12 bg-white/[0.035] text-white/68 hover:border-white/30 hover:bg-white/[0.07]'
                    }`}
                  >
                    {department}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className='border border-white/12 bg-black/22 px-5 py-12 text-center text-white/62'>
                Loading job openings...
              </div>
            ) : openings.length === 0 ? (
              <div className='border border-white/12 bg-black/22 px-5 py-12 text-center'>
                <p className='text-xl font-semibold text-white'>
                  No open roles right now
                </p>
                <p className='mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/58'>
                  Submit a general application and the HR team can review your
                  profile when a suitable opening becomes available.
                </p>
              </div>
            ) : filteredOpenings.length === 0 ? (
              <div className='border border-white/12 bg-black/22 px-5 py-12 text-center text-white/62'>
                No roles match this department filter.
              </div>
            ) : (
              <div className='grid gap-4'>
                {filteredOpenings.map((job, index) => {
                  const isExpanded = expandedJobId === job.id;
                  const descriptionBullets = getDescriptionBullets(
                    job.description,
                  );

                  return (
                    <motion.article
                      key={job.id}
                      initial={{ opacity: 0, y: 22 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.16 }}
                      transition={{
                        delay: index * 0.06,
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className='border border-white/12 bg-black/24 transition-colors duration-200 hover:border-[hsl(var(--brand-gold)/0.58)] hover:bg-black/34'
                    >
                      <div className='grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:p-6'>
                        <div className='min-w-0'>
                          <h3 className='break-words text-2xl font-semibold leading-tight text-white sm:text-3xl'>
                            {job.title}
                          </h3>
                          <div className='mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-white/58'>
                            <span className='inline-flex items-center gap-2'>
                              <BriefcaseBusiness className='h-4 w-4 text-[hsl(var(--brand-gold))]' />
                              {job.department}
                            </span>
                            <span className='inline-flex items-center gap-2'>
                              <MapPin className='h-4 w-4 text-[hsl(var(--brand-gold))]' />
                              {job.location}
                            </span>
                            <span className='inline-flex items-center gap-2'>
                              <Clock className='h-4 w-4 text-[hsl(var(--brand-gold))]' />
                              {job.type}
                            </span>
                          </div>
                        </div>

                        <div className='flex flex-wrap gap-3 lg:justify-end'>
                          <button
                            type='button'
                            onClick={() =>
                              setExpandedJobId((current) =>
                                current === job.id ? null : job.id,
                              )
                            }
                            className='inline-flex cursor-pointer items-center justify-center gap-3 border border-white/14 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:border-white/35 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-[hsl(var(--brand-black-800))]'
                            aria-expanded={isExpanded}
                          >
                            Details
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          <button
                            type='button'
                            onClick={() => handleApplyNow(job)}
                            className='inline-flex cursor-pointer items-center justify-center gap-3 border border-[hsl(var(--brand-gold))] bg-[hsl(var(--brand-cream))] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[hsl(var(--brand-black))] transition-colors duration-200 hover:bg-[hsl(var(--brand-yellow))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-gold))] focus:ring-offset-2 focus:ring-offset-[hsl(var(--brand-black-800))]'
                          >
                            Apply
                            <ArrowRight className='h-4 w-4' />
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className='overflow-hidden border-t border-white/12'
                          >
                            <div className='grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:p-6'>
                              {descriptionBullets.length > 0 ? (
                                <ul className='grid gap-3 text-sm leading-7 text-white/70'>
                                  {descriptionBullets.map(
                                    (bullet, itemIndex) => (
                                      <li
                                        key={`${job.id}-description-${itemIndex}`}
                                        className='grid grid-cols-[0.75rem_minmax(0,1fr)] gap-3'
                                      >
                                        <span className='mt-[0.7rem] h-1.5 w-1.5 bg-[hsl(var(--brand-gold))]' />
                                        <span>{bullet}</span>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              ) : (
                                <p className='text-sm leading-7 text-white/66'>
                                  No description available.
                                </p>
                              )}
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className='bg-[hsl(var(--brand-black))] py-12 sm:py-16 lg:py-20'>
          <div className='container-custom max-w-[96rem]'>
            <div className='grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:items-start'>
              <motion.aside
                initial={{ opacity: 0, x: -28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                className='lg:sticky lg:top-28'
              >
                <p className='mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-white/48'>
                  Candidate Experience
                </p>
                <h2 className='break-words text-3xl font-bold uppercase tracking-[0.08em] text-[hsl(var(--brand-gold))] sm:text-4xl md:text-5xl'>
                  Apply once. Make it count.
                </h2>
                <p className='mt-5 max-w-xl text-sm leading-7 text-white/62'>
                  Choose a role, upload your CV, and add context that helps HR
                  understand where your experience can create value.
                </p>

                <div className='mt-8 grid gap-3'>
                  {benefits.map((benefit) => (
                    <div
                      key={benefit}
                      className='flex items-center gap-3 border border-white/10 bg-white/[0.03] p-4 text-sm font-medium text-white/78'
                    >
                      <Check className='h-4 w-4 shrink-0 text-[hsl(var(--brand-gold))]' />
                      {benefit}
                    </div>
                  ))}
                </div>
              </motion.aside>

              <motion.div
                ref={formRef}
                id='apply-form'
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                className='overflow-hidden border border-[hsl(var(--brand-gold)/0.24)] bg-[hsl(var(--brand-cream))] text-[hsl(var(--brand-black))] shadow-[0_1.75rem_4rem_rgba(0,0,0,0.28)]'
              >
                <div className='grid border-b border-[hsl(var(--brand-black)/0.12)] bg-white/48 lg:grid-cols-[minmax(0,1fr)_16rem]'>
                  <div className='p-5 sm:p-7 lg:p-8'>
                    <p className='mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[hsl(var(--brand-black)/0.58)]'>
                      <Send className='h-4 w-4 text-[hsl(var(--brand-gold))]' />
                      Job Application
                    </p>
                    <h2 className='max-w-2xl text-3xl font-bold uppercase leading-[0.98] tracking-[0.06em] text-[hsl(var(--brand-black))] sm:text-4xl'>
                      Send the essentials.
                    </h2>
                    <p className='mt-4 max-w-2xl text-sm leading-7 text-[hsl(var(--brand-black)/0.62)]'>
                      A concise application helps HR review your fit quickly.
                      Choose a role, add your contact details, and attach your
                      CV.
                    </p>
                  </div>

                  <div className='grid border-t border-[hsl(var(--brand-black)/0.12)] bg-[hsl(var(--brand-black))] p-5 text-white lg:border-l lg:border-t-0 lg:p-6'>
                    <p className='text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white/46'>
                      File rules
                    </p>
                    <div className='mt-5 self-end'>
                      <p className='text-2xl font-bold text-[hsl(var(--brand-gold))]'>
                        20MB
                      </p>
                      <p className='mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/58'>
                        PDF / DOC / DOCX
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className='p-5 sm:p-7 lg:p-8'>
                  <div className='grid gap-x-6 gap-y-5 lg:grid-cols-2'>
                    <div className='lg:col-span-2'>
                      <label
                        htmlFor='career-position'
                        className='mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[hsl(var(--brand-black)/0.56)]'
                      >
                        Applying for
                      </label>
                      <Select
                        value={selectedJobId}
                        onValueChange={handleJobSelect}
                      >
                        <SelectTrigger
                          id='career-position'
                          className='h-14 border-[hsl(var(--brand-black)/0.18)] bg-white px-4 text-[hsl(var(--brand-black))] shadow-sm focus:ring-[hsl(var(--brand-gold))]'
                        >
                          <SelectValue placeholder='Select a position' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='general'>
                            General Application
                          </SelectItem>
                          {openings.map((job) => (
                            <SelectItem key={job.id} value={job.id}>
                              {job.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className='mt-3 border-l-2 border-[hsl(var(--brand-gold))] bg-white/58 px-4 py-3'>
                        {selectedJob ? (
                          <>
                            <div className='mb-2 flex items-center gap-2 text-sm font-semibold text-[hsl(var(--brand-black))]'>
                              <FileText className='h-4 w-4 text-[hsl(var(--brand-gold))]' />
                              {selectedJob.title}
                            </div>
                            <div className='flex flex-wrap gap-3 text-sm text-[hsl(var(--brand-black)/0.58)]'>
                              <span>{selectedJob.department}</span>
                              <span>/</span>
                              <span>{selectedJob.location}</span>
                              <span>/</span>
                              <span>{selectedJob.type}</span>
                            </div>
                          </>
                        ) : (
                          <p className='text-sm leading-6 text-[hsl(var(--brand-black)/0.58)]'>
                            General applications are reviewed for future role
                            matches.
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor='career-name'
                        className='mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[hsl(var(--brand-black)/0.56)]'
                      >
                        Full name *
                      </label>
                      <Input
                        id='career-name'
                        required
                        value={formData.name}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            name: event.target.value,
                          })
                        }
                        placeholder='Your full name'
                        autoComplete='name'
                        className='h-14 border-[hsl(var(--brand-black)/0.16)] bg-white px-4 text-[hsl(var(--brand-black))] shadow-sm placeholder:text-[hsl(var(--brand-black)/0.38)] focus-visible:ring-[hsl(var(--brand-gold))]'
                      />
                    </div>

                    <div>
                      <label
                        htmlFor='career-email'
                        className='mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[hsl(var(--brand-black)/0.56)]'
                      >
                        Email *
                      </label>
                      <Input
                        id='career-email'
                        type='email'
                        required
                        value={formData.email}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            email: event.target.value,
                          })
                        }
                        placeholder='name@example.com'
                        autoComplete='email'
                        className='h-14 border-[hsl(var(--brand-black)/0.16)] bg-white px-4 text-[hsl(var(--brand-black))] shadow-sm placeholder:text-[hsl(var(--brand-black)/0.38)] focus-visible:ring-[hsl(var(--brand-gold))]'
                      />
                    </div>

                    <div>
                      <label
                        htmlFor='career-phone'
                        className='mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[hsl(var(--brand-black)/0.56)]'
                      >
                        Phone *
                      </label>
                      <Input
                        id='career-phone'
                        type='tel'
                        required
                        value={formData.phone}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            phone: event.target.value,
                          })
                        }
                        placeholder='Phone number'
                        autoComplete='tel'
                        className='h-14 border-[hsl(var(--brand-black)/0.16)] bg-white px-4 text-[hsl(var(--brand-black))] shadow-sm placeholder:text-[hsl(var(--brand-black)/0.38)] focus-visible:ring-[hsl(var(--brand-gold))]'
                      />
                    </div>

                    <div>
                      <label
                        htmlFor='cv-upload'
                        className='mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[hsl(var(--brand-black)/0.56)]'
                      >
                        Upload CV *
                      </label>
                      <div
                        className={`flex min-h-14 items-center border border-dashed px-4 transition-colors duration-200 ${
                          isDraggingCv
                            ? 'border-[hsl(var(--brand-gold))] bg-[hsl(var(--brand-gold)/0.14)]'
                            : 'border-[hsl(var(--brand-black)/0.18)] bg-white hover:border-[hsl(var(--brand-gold)/0.5)]'
                        }`}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <input
                          ref={fileInputRef}
                          accept='.pdf,.doc,.docx'
                          className='hidden'
                          id='cv-upload'
                          type='file'
                          onChange={handleFileChange}
                        />
                        {cvFile ? (
                          <div className='flex min-w-0 flex-1 items-center justify-between gap-3'>
                            <div className='min-w-0'>
                              <p className='truncate text-sm font-semibold text-[hsl(var(--brand-black))]'>
                                {cvFile.name}
                              </p>
                              <p className='mt-0.5 text-xs text-[hsl(var(--brand-black)/0.52)]'>
                                {(cvFile.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                            <button
                              type='button'
                              className='inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center border border-[hsl(var(--brand-black)/0.16)] text-[hsl(var(--brand-black)/0.58)] transition-colors duration-200 hover:border-[hsl(var(--brand-gold))] hover:text-[hsl(var(--brand-gold))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-gold))]'
                              onClick={clearCvFile}
                              aria-label='Remove selected CV'
                            >
                              <X className='h-4 w-4' />
                            </button>
                          </div>
                        ) : (
                          <label
                            htmlFor='cv-upload'
                            className='flex min-w-0 flex-1 cursor-pointer items-center gap-3'
                          >
                            <Upload className='h-5 w-5 shrink-0 text-[hsl(var(--brand-gold))]' />
                            <span className='min-w-0'>
                              <span className='block truncate text-sm font-semibold text-[hsl(var(--brand-black))]'>
                                Attach your CV
                              </span>
                              <span className='block truncate text-xs text-[hsl(var(--brand-black)/0.52)]'>
                                PDF, DOC, DOCX. Max 20 MB.
                              </span>
                            </span>
                          </label>
                        )}
                      </div>
                    </div>

                    <div className='lg:col-span-2'>
                      <label
                        htmlFor='career-message'
                        className='mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[hsl(var(--brand-black)/0.56)]'
                      >
                        Note to HR
                      </label>
                      <Textarea
                        id='career-message'
                        value={formData.message}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            message: event.target.value,
                          })
                        }
                        placeholder='Optional: add your focus area, notice period, or portfolio link.'
                        rows={4}
                        className='min-h-28 border-[hsl(var(--brand-black)/0.16)] bg-white px-4 py-3 text-[hsl(var(--brand-black))] shadow-sm placeholder:text-[hsl(var(--brand-black)/0.38)] focus-visible:ring-[hsl(var(--brand-gold))]'
                      />
                    </div>
                  </div>

                  <div className='mt-6 grid gap-4 border-t border-[hsl(var(--brand-black)/0.12)] pt-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center'>
                    <p className='text-xs leading-6 text-[hsl(var(--brand-black)/0.56)]'>
                      By submitting, you confirm the information is accurate and
                      allow Wealth Holding HR to contact you about relevant
                      opportunities.
                    </p>
                    <AnimatedPillButton
                      type='submit'
                      label={
                        isSubmitting ? 'Submitting...' : 'Submit Application'
                      }
                      tone='dark'
                      className='w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto'
                      labelClassName='text-sm md:text-base'
                      disabled={isSubmitting}
                    />
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        <section className='overflow-hidden bg-[hsl(var(--brand-black-800))] py-10'>
          <div className='container-custom max-w-[96rem]'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {journeySteps.map((step, index) => (
                <div
                  key={step}
                  className='flex items-center gap-4 border border-white/10 bg-white/[0.03] p-4'
                >
                  <span className='flex h-10 w-10 shrink-0 items-center justify-center border border-[hsl(var(--brand-gold)/0.55)] text-sm font-bold text-[hsl(var(--brand-gold))]'>
                    {index + 1}
                  </span>
                  <div>
                    <p className='text-sm font-semibold text-white'>{step}</p>
                    <p className='mt-1 text-xs uppercase tracking-[0.16em] text-white/40'>
                      Hiring process
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Careers;
