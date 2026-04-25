import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import 'flag-icons/css/flag-icons.min.css';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  PenLine,
  Phone,
  User,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import AnimatedPillButton from '@/components/ui/AnimatedPillButton';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useSEO } from '@/hooks/useSEO';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

const contactInfo = [
  {
    icon: MapPin,
    title: 'New Cairo Office',
    lines: [
      'Ground Floor, 235 Office Building - Section 2, N Teseen, New Cairo 1, Cairo Governorate',
    ],
  },
  {
    icon: MapPin,
    title: 'Sheikh Zayed Office',
    lines: [
      'Building 2, 6th Floor - Capital Business Park, Sheikh Zayed, Cairo, Egypt',
    ],
  },
  {
    icon: Phone,
    title: 'Call Us',
    lines: ['Hotline: 19640'],
  },
  {
    icon: Mail,
    title: 'Email Us',
    lines: ['info@wealthholding-eg.com', 'hr@wealthholding-eg.com'],
  },
  {
    icon: Clock,
    title: 'Business Hours',
    lines: ['10:00 AM - 7:00 PM'],
  },
];

const socialLinks = [
  {
    href: 'https://facebook.com',
    iconClass: 'ri-facebook-fill',
    label: 'Facebook',
  },
  {
    href: 'https://linkedin.com',
    iconClass: 'ri-linkedin-fill',
    label: 'LinkedIn',
  },
  {
    href: 'https://instagram.com',
    iconClass: 'ri-instagram-line',
    label: 'Instagram',
  },
  {
    href: 'https://youtube.com',
    iconClass: 'ri-youtube-fill',
    label: 'YouTube',
  },
  {
    href: 'https://wa.me/201090000000',
    iconClass: 'ri-whatsapp-fill',
    label: 'WhatsApp',
  },
];

interface ProjectOption {
  id: string;
  title: string;
}

const officeLocations = [
  {
    id: 'new-cairo',
    label: 'New Cairo Office',
    address:
      'Ground Floor, 235 Office Building - Section 2, N Teseen, New Cairo 1, Cairo Governorate',
    phone: '19640',
    email: 'info@wealthholding-eg.com',
    tileX: 4812,
    tileY: 3379,
    mapX: '66%',
    mapY: '42%',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Ground+Floor+235+Office+Building+Section+2+N+Teseen+New+Cairo+1+Cairo+Governorate',
  },
  {
    id: 'sheikh-zayed',
    label: 'Sheikh Zayed Office',
    address:
      'Building 2, 6th Floor - Capital Business Park, Sheikh Zayed, Cairo, Egypt',
    phone: '19640',
    email: 'info@wealthholding-eg.com',
    tileX: 4800,
    tileY: 3378,
    mapX: '34%',
    mapY: '64%',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Building+2+Capital+Business+Park+26th+of+July+Corridor+Sheikh+Zayed+City+Giza+Governorate+Egypt',
  },
];

const responseNotes = [
  'Consultant-led follow up',
  'Project-specific guidance',
  'Two office locations',
];

const inputShellClass =
  'group relative block rounded-lg border border-white/10 bg-white/[0.045] transition-colors focus-within:border-[hsl(var(--brand-red-500))] focus-within:bg-white/[0.07]';

const inputIconClass =
  'pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/36 transition-colors group-focus-within:text-[hsl(var(--brand-red-500))]';

const Contact = () => {
  useSEO({
    title: 'Contact Us | Wealth Holding',
    description: 'Get in touch with Wealth Holding. Find our office locations, contact information, or send us a message directly.'
  });
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+20');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectId: 'general',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/api/projects`);

        if (!response.ok) {
          throw new Error('Failed to load projects.');
        }

        const data = await response.json();
        setProjects(
          Array.isArray(data)
            ? data
                .filter(
                  (project) =>
                    typeof project?.id === 'string' &&
                    typeof project?.title === 'string',
                )
                .map((project) => ({
                  id: project.id,
                  title: project.title,
                }))
            : [],
        );
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const trimmedPhone = formData.phone.trim();
      const phoneWithCountryCode = trimmedPhone.startsWith('+')
        ? trimmedPhone
        : `${selectedCountryCode}${trimmedPhone.replace(/^0+/, '')}`;

      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phone: phoneWithCountryCode,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || 'Failed to send message.');
      }

      toast({
        title: 'Message Sent',
        description:
          'Your message was delivered to Wealth Holding HR. Our team will contact you shortly.',
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectId: 'general',
        message: '',
      });
      setSelectedCountryCode('+20');
    } catch (error) {
      toast({
        title: 'Message not sent',
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
      <section className='relative min-h-screen overflow-hidden bg-[hsl(var(--brand-black))] pt-28 text-white sm:pt-32'>
        <div
          className='pointer-events-none absolute inset-0'
          aria-hidden='true'
        >
          <div className='absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--brand-black))_0%,hsl(var(--brand-black-900))_100%)]' />
          <div className='absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.026)_1px,transparent_1px)] bg-[size:64px_64px] opacity-45' />
        </div>

        <div className='container-custom relative pb-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className='mb-6 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end'
          >
            <div>
              <span className='mb-3 inline-flex rounded-full border border-white/12 bg-white/[0.055] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/62'>
                Contact
              </span>
              <h1 className='max-w-3xl font-sans text-4xl font-black leading-[0.98] tracking-tight text-white sm:text-5xl lg:text-6xl'>
                Let us connect you to the right team.
              </h1>
            </div>

            <div className='grid gap-2 text-sm sm:grid-cols-2 lg:w-[24rem] lg:grid-cols-1'>
              <a
                href='tel:19640'
                className='group flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.045] px-4 py-3 transition-colors hover:border-[hsl(var(--brand-red-500)/0.7)] hover:bg-white/[0.06]'
              >
                <span>
                  <span className='block text-xs text-white/46'>Hotline</span>
                  <span className='font-black text-white'>19640</span>
                </span>
                <ArrowRight className='h-4 w-4 text-[hsl(var(--brand-white))] transition-transform group-hover:translate-x-1' />
              </a>
              <a
                href='mailto:info@wealthholding-eg.com'
                className='group flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.045] px-4 py-3 transition-colors hover:border-[hsl(var(--brand-red-500)/0.7)] hover:bg-white/[0.06]'
              >
                <span>
                  <span className='block text-xs text-white/46'>Email</span>
                  <span className='text-xs font-bold text-white sm:text-sm'>
                    info@wealthholding-eg.com
                  </span>
                </span>
                <ArrowRight className='h-4 w-4 text-[hsl(var(--brand-white))] transition-transform group-hover:translate-x-1' />
              </a>
            </div>
          </motion.div>

          <div className='grid items-stretch gap-4 xl:grid-cols-[minmax(0,1fr)_26rem]'>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className='flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.032] p-5 sm:p-6'
            >
              <div className='mb-5 flex flex-wrap items-end justify-between gap-3'>
                <div>
                  <p className='mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--brand-red-500))]'>
                    Message
                  </p>
                  <h2 className='text-2xl font-black tracking-tight text-white'>
                    Tell us what you need
                  </h2>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {responseNotes.map((note) => (
                    <span
                      key={note}
                      className='inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-xs text-white/58'
                    >
                      <CheckCircle2 className='h-3.5 w-3.5 text-[hsl(var(--brand-red-500))]' />
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid gap-5 sm:grid-cols-2'>
                  <label className='space-y-2'>
                    <span className='text-sm font-medium text-white/82'>
                      Full Name *
                    </span>
                    <span className={inputShellClass}>
                      <User className={inputIconClass} />
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder='Your full name'
                        className='border-0 bg-transparent pl-11 text-white placeholder:text-white/32 focus-visible:ring-0'
                      />
                    </span>
                  </label>
                  <label className='space-y-2'>
                    <span className='text-sm font-medium text-white/82'>
                      Email *
                    </span>
                    <span className={inputShellClass}>
                      <Mail className={inputIconClass} />
                      <Input
                        type='email'
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder='your@email.com'
                        className='border-0 bg-transparent pl-11 text-white placeholder:text-white/32 focus-visible:ring-0'
                      />
                    </span>
                  </label>
                </div>

                <div className='grid gap-5 sm:grid-cols-2'>
                  <label className='space-y-2'>
                    <span className='text-sm font-medium text-white/82'>
                      Phone *
                    </span>
                    <span className='group flex overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] transition-colors focus-within:border-[hsl(var(--brand-red-500))] focus-within:bg-white/[0.07]'>
                      <Select
                        value={selectedCountryCode}
                        onValueChange={setSelectedCountryCode}
                      >
                        <SelectTrigger
                          aria-label='Country code'
                          className='h-10 w-[118px] shrink-0 rounded-none border-0 border-r border-white/10 bg-transparent px-3 text-white focus:ring-0 [&>svg]:text-white/45'
                        >
                          {COUNTRIES.find(
                            (country) => country.code === selectedCountryCode,
                          ) && (
                            <span className='inline-flex items-center'>
                              <i
                                className={`fi fi-${
                                  COUNTRIES.find(
                                    (country) =>
                                      country.code === selectedCountryCode,
                                  )?.isoCode
                                } mr-2 h-4 w-5 rounded-sm`}
                              />
                              <span className='text-sm'>
                                {selectedCountryCode}
                              </span>
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
                                  className={`fi fi-${country.isoCode} mr-2 h-4 w-5 rounded-sm`}
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
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder={`${selectedCountryCode.replace('+', '')}xxxxxxxxxx`}
                        className='min-w-0 flex-1 border-0 bg-transparent px-3 text-white placeholder:text-white/32 focus-visible:ring-0'
                      />
                    </span>
                  </label>
                  <label className='space-y-2'>
                    <span className='text-sm font-medium text-white/82'>
                      Project of Interest
                    </span>
                    <span className={inputShellClass}>
                      <Building2 className={inputIconClass} />
                      <Select
                        value={formData.projectId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, projectId: value })
                        }
                        disabled={projectsLoading}
                      >
                        <SelectTrigger className='border-0 bg-transparent pl-11 text-white focus:ring-0'>
                          <SelectValue
                            placeholder={
                              projectsLoading
                                ? 'Loading projects...'
                                : 'Select a project'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='general'>
                            General inquiry
                          </SelectItem>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </span>
                  </label>
                </div>

                <label className='block space-y-2'>
                  <span className='text-sm font-medium text-white/82'>
                    Message *
                  </span>
                  <span className='group relative block rounded-lg border border-white/10 bg-white/[0.04] transition-colors focus-within:border-[hsl(var(--brand-red-500))] focus-within:bg-white/[0.06]'>
                    <PenLine className='pointer-events-none absolute left-4 top-4 h-4 w-4 text-white/36 transition-colors group-focus-within:text-[hsl(var(--brand-red-500))]' />
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder='How can we help?'
                      rows={4}
                      className='border-0 bg-transparent pl-11 text-white placeholder:text-white/32 focus-visible:ring-0'
                    />
                  </span>
                </label>

                <AnimatedPillButton
                  type='submit'
                  label={isSubmitting ? 'Sending...' : 'Send Message'}
                  tone='brand'
                  className='w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-50'
                  labelClassName='text-sm md:text-base'
                  disabled={isSubmitting}
                />
              </form>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className='h-full'
            >
              <div className='flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.032] p-4 sm:p-5'>
                <div className='mb-4 flex items-center justify-between gap-3'>
                  <p className='text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--brand-red-500))]'>
                    Offices
                  </p>
                  <span className='text-xs text-white/40'>Cairo axis</span>
                </div>

                <div className='relative h-60 overflow-hidden rounded-lg border border-white/10 bg-[hsl(var(--brand-black-900))]'>
                  <svg
                    className='absolute inset-0 h-full w-full'
                    viewBox='0 0 360 224'
                    role='img'
                    aria-label='Stylized map showing New Cairo and Sheikh Zayed office locations'
                  >
                    <defs>
                      <linearGradient id='contactMapRoute' x1='0' x2='1'>
                        <stop offset='0%' stopColor='rgba(255,255,255,0.16)' />
                        <stop
                          offset='48%'
                          stopColor='hsl(var(--brand-red-500))'
                        />
                        <stop
                          offset='100%'
                          stopColor='rgba(255,255,255,0.18)'
                        />
                      </linearGradient>
                      <radialGradient id='contactMapGlow'>
                        <stop offset='0%' stopColor='rgba(255,255,255,0.18)' />
                        <stop offset='100%' stopColor='rgba(255,255,255,0)' />
                      </radialGradient>
                    </defs>
                    <rect width='360' height='224' fill='transparent' />
                    <path
                      d='M-20 48 C64 18 116 80 181 52 C240 27 285 34 382 16'
                      fill='none'
                      stroke='rgba(255,255,255,0.07)'
                      strokeWidth='1.2'
                    />
                    <path
                      d='M-12 174 C62 127 112 150 154 121 C205 85 258 107 374 72'
                      fill='none'
                      stroke='rgba(255,255,255,0.08)'
                      strokeWidth='1.2'
                    />
                    <path
                      d='M38 188 C72 128 116 105 160 124 C207 145 226 84 273 74'
                      fill='none'
                      stroke='url(#contactMapRoute)'
                      strokeWidth='2.5'
                      strokeLinecap='round'
                      strokeDasharray='5 9'
                    />
                    <circle
                      cx='122'
                      cy='143'
                      r='78'
                      fill='url(#contactMapGlow)'
                    />
                    <circle
                      cx='238'
                      cy='92'
                      r='86'
                      fill='url(#contactMapGlow)'
                    />
                    <path
                      d='M59 34 L116 20 L171 39 L224 28 L305 47 L330 112 L299 184 L230 202 L170 183 L113 199 L43 166 L29 91 Z'
                      fill='rgba(255,255,255,0.025)'
                      stroke='rgba(255,255,255,0.09)'
                      strokeWidth='1'
                    />
                  </svg>

                  {officeLocations.map((office) => (
                    <a
                      key={`${office.id}-pin`}
                      href={office.mapsUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      style={{ left: office.mapX, top: office.mapY }}
                      className='group absolute z-10 -translate-x-1/2 -translate-y-1/2'
                      aria-label={`Open ${office.label} in Google Maps`}
                    >
                      <span className='relative flex h-12 w-12 items-center justify-center rounded-full border border-white/18 bg-[hsl(var(--brand-gold))] text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-105'>
                        <span className='absolute inset-[-5px] rounded-full border border-[hsl(var(--brand-red-500)/0.42)] opacity-70 transition-opacity duration-300 group-hover:opacity-100' />
                        <MapPin className='relative h-5 w-5' />
                      </span>
                      <span className='absolute left-1/2 top-full mt-2 hidden min-w-32 -translate-x-1/2 rounded-md border border-white/10 bg-black/70 px-3 py-2 text-center text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white sm:block'>
                        {office.label.replace(' Office', '')}
                      </span>
                    </a>
                  ))}
                </div>

                <div className='mt-3 grid gap-2'>
                  {officeLocations.map((office) => (
                    <a
                      key={office.id}
                      href={office.mapsUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='group flex gap-3 rounded-lg border border-white/8 bg-transparent p-3 transition-colors hover:border-[hsl(var(--brand-red-500)/0.6)] hover:bg-white/[0.035]'
                    >
                      <span className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-[hsl(var(--brand-white))]'>
                        <MapPin className='h-4 w-4' />
                      </span>
                      <span className='min-w-0'>
                        <span className='flex items-center justify-between gap-2 text-sm font-black uppercase tracking-[0.12em] text-white'>
                          {office.label}
                          <ExternalLink className='h-3.5 w-3.5 shrink-0 text-white/36 group-hover:text-[hsl(var(--brand-red-500))]' />
                        </span>
                        <span className='mt-1 block text-xs leading-5 text-white/54'>
                          {office.address}
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.aside>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.14,
              ease: [0.22, 1, 0.36, 1],
            }}
            className='mt-4 rounded-lg border border-white/10 bg-white/[0.032] p-4'
          >
            <div className='grid gap-4 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] lg:items-center'>
              {contactInfo.slice(2).map((item) => (
                <div key={item.title} className='flex gap-3'>
                  <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-[hsl(var(--brand-red-500))]'>
                    <item.icon className='h-4 w-4' />
                  </span>
                  <span>
                    <span className='block text-sm font-semibold text-white'>
                      {item.title}
                    </span>
                    {item.lines.map((line) => (
                      <span
                        key={line}
                        className='block text-xs leading-5 text-white/56'
                      >
                        {line}
                      </span>
                    ))}
                  </span>
                </div>
              ))}

              <div className='flex flex-wrap items-center gap-2 border-t border-white/10 pt-4 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0'>
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={link.label}
                    title={link.label}
                    className='flex h-9 w-9 items-center justify-center rounded-full border border-white/14 bg-white/[0.05] text-white/72 transition-colors hover:border-[hsl(var(--brand-red-500))] hover:text-[hsl(var(--brand-red-500))]'
                  >
                    <i
                      className={`${link.iconClass} text-[1.05rem]`}
                      aria-hidden='true'
                    />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
