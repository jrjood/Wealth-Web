import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import 'flag-icons/css/flag-icons.min.css';
import { Layout } from '@/components/layout/Layout';
import {
  Briefcase,
  ChevronDown,
  Clock,
  FileText,
  MapPin,
  Upload,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const MAX_CV_SIZE = 20 * 1024 * 1024;
const ALLOWED_CV_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const ALLOWED_CV_EXTENSIONS = ['.pdf', '.doc', '.docx'];

const COUNTRIES = [
  { name: 'United Arab Emirates', code: '+971', isoCode: 'ae' },
  { name: 'Saudi Arabia', code: '+966', isoCode: 'sa' },
  { name: 'Egypt', code: '+20', isoCode: 'eg' },
  { name: 'Kuwait', code: '+965', isoCode: 'kw' },
  { name: 'Qatar', code: '+974', isoCode: 'qa' },
  { name: 'Bahrain', code: '+973', isoCode: 'bh' },
  { name: 'Oman', code: '+968', isoCode: 'om' },
  { name: 'Jordan', code: '+962', isoCode: 'jo' },
  { name: 'Lebanon', code: '+961', isoCode: 'lb' },
  { name: 'Palestine', code: '+970', isoCode: 'ps' },
  { name: 'Iraq', code: '+964', isoCode: 'iq' },
  { name: 'Syria', code: '+963', isoCode: 'sy' },
  { name: 'United Kingdom', code: '+44', isoCode: 'gb' },
  { name: 'United States', code: '+1', isoCode: 'us' },
  { name: 'Canada', code: '+1', isoCode: 'ca' },
  { name: 'Australia', code: '+61', isoCode: 'au' },
  { name: 'India', code: '+91', isoCode: 'in' },
  { name: 'Pakistan', code: '+92', isoCode: 'pk' },
  { name: 'France', code: '+33', isoCode: 'fr' },
  { name: 'Germany', code: '+49', isoCode: 'de' },
];

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

const benefits = [
  'Competitive salary packages',
  'Health insurance coverage',
  'Annual performance bonuses',
  'Professional development',
  'Flexible work arrangements',
  'Employee wellness programs',
];

const Careers = () => {
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState('general');
  const [openings, setOpenings] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraggingCv, setIsDraggingCv] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+20');
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

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
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
  };

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
    if (!file) {
      return;
    }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const selectedJob = openings.find((job) => job.id === formData.jobId);
      const applicationData = new FormData();
      applicationData.append('name', formData.name.trim());
      applicationData.append('email', formData.email.trim());
      applicationData.append('phone', formData.phone.trim());
      applicationData.append('jobId', formData.jobId);
      applicationData.append(
        'jobTitle',
        selectedJob?.title ?? 'General Application',
      );
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
      setSelectedCountryCode('+20');
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

  const selectedJob = openings.find((job) => job.id === selectedJobId);

  return (
    <Layout>
      <section className='bg-muted pt-32 pb-20'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='mx-auto max-w-3xl text-center'
          >
            <h1 className='heading-display mb-6 text-foreground'>
              Join Our Team
            </h1>
            <p className='text-body-lg text-foreground/70'>
              Build your career with a company that’s shaping the future of real
              estate.
            </p>
          </motion.div>
        </div>
      </section>

      <section className='section-padding bg-background'>
        <div className='container-custom'>
          <div className='grid items-center gap-16 lg:grid-cols-2'>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className='mb-4 block text-sm font-semibold uppercase tracking-wide text-secondary'>
                Why Join Us
              </span>
              <h2 className='heading-section mb-6 text-foreground'>
                A Career Built on Excellence
              </h2>
              <p className='text-body-lg mb-8 text-muted-foreground'>
                At Wealth Holding, we believe our people are our greatest asset.
                We offer a dynamic work environment, opportunities for growth,
                and the chance to work on iconic projects that shape skylines.
              </p>
              <div className='grid gap-4 sm:grid-cols-2'>
                {benefits.map((benefit) => (
                  <div key={benefit} className='flex items-center gap-3'>
                    <div className='h-2 w-2 rounded-full bg-primary' />
                    <span className='text-foreground'>{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='aspect-square overflow-hidden rounded-sm bg-muted shadow-[0_4px_24px_-4px_hsl(0_0%_0%_/_0.08)]'
            >
              <img
                src='https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80'
                alt='Professional team collaborating in a modern office'
                className='h-full w-full object-cover transition-transform duration-700 hover:scale-105'
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className='section-padding bg-muted'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='mb-16 text-center'
          >
            <span className='mb-4 block text-sm font-semibold uppercase tracking-wide text-secondary'>
              Opportunities
            </span>
            <h2 className='heading-section text-foreground'>Open Positions</h2>
          </motion.div>

          {loading ? (
            <div className='py-12 text-center'>
              <p className='text-lg text-muted-foreground'>
                Loading job openings...
              </p>
            </div>
          ) : openings.length === 0 ? (
            <div className='py-12 text-center'>
              <p className='text-lg text-muted-foreground'>
                No job openings at the moment. Check back soon!
              </p>
            </div>
          ) : (
            <div className='mx-auto max-w-4xl space-y-4'>
              {openings.map((job, index) => {
                const isExpanded = expandedJobId === job.id;

                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className='cursor-pointer rounded-sm bg-card card-elevated'
                      onClick={() =>
                        setExpandedJobId((current) =>
                          current === job.id ? null : job.id,
                        )
                      }
                    >
                      <div className='flex items-center justify-between p-6'>
                        <div>
                          <h3 className='mb-2 text-lg font-semibold text-foreground'>
                            {job.title}
                          </h3>
                          <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
                            <span className='flex items-center gap-1'>
                              <Briefcase className='h-4 w-4' />
                              {job.department}
                            </span>
                            <span className='flex items-center gap-1'>
                              <MapPin className='h-4 w-4' />
                              {job.location}
                            </span>
                            <span className='flex items-center gap-1'>
                              <Clock className='h-4 w-4' />
                              {job.type}
                            </span>
                          </div>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 text-muted-foreground transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>

                      <AnimatePresence>
                        {isExpanded ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28 }}
                            className='overflow-hidden border-t border-border px-6 pb-6'
                          >
                            <p className='mt-4 mb-5 text-muted-foreground'>
                              {job.description}
                            </p>
                            <Button
                              variant='default'
                              onClick={(event) => {
                                event.stopPropagation();
                                handleApplyNow(job);
                              }}
                            >
                              Apply Now
                            </Button>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section id='apply-form' className='section-padding bg-background'>
        <div ref={formRef} className='container-custom max-w-2xl'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='mb-12 text-center'
          >
            <span className='mb-4 block text-sm font-semibold uppercase tracking-wide text-secondary'>
              Apply Now
            </span>
            <h2 className='heading-section text-foreground'>
              Submit Your Application
            </h2>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className='space-y-6'
          >
            <div className='rounded-sm border border-border bg-card p-5'>
              <div className='mb-3 flex items-center justify-between gap-3'>
                <div>
                  <p className='text-sm font-medium text-foreground'>
                    Selected position
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    This is linked to the job you clicked.
                  </p>
                </div>
                {selectedJob ? (
                  <span className='rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary'>
                    From open positions
                  </span>
                ) : null}
              </div>

              <Select value={selectedJobId} onValueChange={handleJobSelect}>
                <SelectTrigger>
                  <SelectValue placeholder='Select a position' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='general'>General Application</SelectItem>
                  {openings.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedJob ? (
                <div className='mt-4 rounded-sm border border-border/60 bg-muted/40 p-4'>
                  <div className='mb-2 flex items-center gap-2 text-sm font-medium text-foreground'>
                    <FileText className='h-4 w-4 text-primary' />
                    {selectedJob.title}
                  </div>
                  <div className='flex flex-wrap gap-3 text-sm text-muted-foreground'>
                    <span>{selectedJob.department}</span>
                    <span>•</span>
                    <span>{selectedJob.location}</span>
                    <span>•</span>
                    <span>{selectedJob.type}</span>
                  </div>
                </div>
              ) : (
                <div className='mt-4 rounded-sm border border-dashed border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground'>
                  You are applying through the general application form.
                </div>
              )}
            </div>

            <div className='grid gap-6 sm:grid-cols-2'>
              <div>
                <label className='mb-2 block text-sm font-medium text-foreground'>
                  Full Name *
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(event) =>
                    setFormData({ ...formData, name: event.target.value })
                  }
                  placeholder='Your full name'
                />
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-foreground'>
                  Email *
                </label>
                <Input
                  type='email'
                  required
                  value={formData.email}
                  onChange={(event) =>
                    setFormData({ ...formData, email: event.target.value })
                  }
                  placeholder='your@email.com'
                />
              </div>
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium text-foreground'>
                Phone *
              </label>
              <div className='flex gap-3'>
                <Select
                  value={selectedCountryCode}
                  onValueChange={setSelectedCountryCode}
                >
                  <SelectTrigger className='w-[160px] px-3'>
                    {COUNTRIES.find((c) => c.code === selectedCountryCode) && (
                      <span className='inline-flex items-center'>
                        <i
                          className={`fi fi-${
                            COUNTRIES.find(
                              (c) => c.code === selectedCountryCode,
                            )?.isoCode
                          } h-5 w-5 rounded-sm mr-2`}
                        />
                        <span>{selectedCountryCode}</span>
                      </span>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem
                        key={`${country.code}-${country.name}`}
                        value={country.code}
                      >
                        <span className='inline-flex items-center'>
                          <i
                            className={`fi fi-${country.isoCode} h-5 w-5 rounded-sm mr-2`}
                          />
                          <span>{country.code}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type='tel'
                  required
                  value={formData.phone}
                  onChange={(event) =>
                    setFormData({ ...formData, phone: event.target.value })
                  }
                  placeholder={`${selectedCountryCode.replace('+', '')}xxxxxxxxxx`}
                  className='flex-1'
                />
              </div>
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium text-foreground'>
                Cover Letter
              </label>
              <Textarea
                value={formData.message}
                onChange={(event) =>
                  setFormData({ ...formData, message: event.target.value })
                }
                placeholder="Tell us about yourself and why you'd be a great fit..."
                rows={5}
              />
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium text-foreground'>
                Upload CV *
              </label>
              <div
                className={`rounded-sm border-2 border-dashed p-8 text-center transition-colors ${
                  isDraggingCv ? 'border-primary bg-primary/5' : 'border-border'
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
                <label
                  htmlFor='cv-upload'
                  className='flex cursor-pointer flex-col items-center gap-3'
                >
                  <div className='flex h-14 w-14 items-center justify-center rounded-full bg-primary/10'>
                    <Upload className='h-6 w-6 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>
                      Drag and drop your CV here, or click to browse
                    </p>
                    <p className='mt-1 text-xs text-muted-foreground'>
                      PDF, DOC, DOCX. Max size 20 MB.
                    </p>
                  </div>
                </label>

                {cvFile ? (
                  <div className='mt-5 flex items-center justify-between gap-4 rounded-sm border border-border bg-background px-4 py-3 text-left'>
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-medium text-foreground'>
                        {cvFile.name}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {(cvFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type='button'
                      className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary'
                      onClick={clearCvFile}
                    >
                      <X className='h-4 w-4' />
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            <Button
              type='submit'
              size='lg'
              className='w-full'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </motion.form>
        </div>
      </section>
    </Layout>
  );
};

export default Careers;
