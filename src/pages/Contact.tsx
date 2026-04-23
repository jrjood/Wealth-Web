import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
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
import { officeBuildingImage } from '@/assets';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Building+2+Capital+Business+Park+26th+of+July+Corridor+Sheikh+Zayed+City+Giza+Governorate+Egypt',
  },
];

const inputShellClass =
  'group relative block rounded-lg border border-white/10 bg-white/[0.04] transition-colors focus-within:border-[hsl(var(--brand-red-500))] focus-within:bg-white/[0.06]';

const inputIconClass =
  'pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/36 transition-colors group-focus-within:text-[hsl(var(--brand-red-500))]';

const Contact = () => {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
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
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
      <section className='bg-[hsl(var(--brand-black))] pt-32 pb-16'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='mx-auto max-w-3xl text-center'
          >
            <h1 className='heading-display text-white mb-6'>Get in Touch</h1>
            <p className='text-body-lg text-white/68'>
              Ready to discuss your next investment or find your dream property?
              Our team is here to help.
            </p>
          </motion.div>
        </div>
      </section>

      <section className='bg-[hsl(var(--brand-black-900))] pb-20 pt-12 sm:pt-14 md:pt-16 lg:pt-20 xl:pt-24'>
        <div className='container-custom space-y-12'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className='grid gap-5 md:grid-cols-2'
          >
            {officeLocations.map((office) => (
              <a
                key={office.id}
                href={office.mapsUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='group block h-full rounded-lg border border-white/10 bg-[hsl(var(--brand-black-800))] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--brand-red-500)/0.75)] hover:shadow-[0_24px_70px_rgba(0,0,0,0.38)]'
              >
                <div className='relative mb-5 aspect-[16/9] overflow-hidden rounded-md border border-white/10 bg-[hsl(var(--brand-black))]'>
                  <div className='absolute inset-0 grid grid-cols-2 opacity-88 transition-transform duration-500 group-hover:scale-[1.03]'>
                    {[0, 1, 2, 3].map((offset) => (
                      <img
                        key={`${office.id}-${offset}`}
                        src={`https://tile.openstreetmap.org/13/${
                          office.tileX + (offset % 2)
                        }/${office.tileY + Math.floor(offset / 2)}.png`}
                        alt=''
                        className='h-full w-full object-cover'
                        loading='lazy'
                      />
                    ))}
                  </div>
                  <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.22))]' />
                  <span className='absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[hsl(var(--brand-red-500))] text-white shadow-[0_10px_28px_rgba(0,0,0,0.35)]'>
                    <MapPin className='h-5 w-5' />
                  </span>
                  <div className='absolute left-3 top-3 rounded-sm bg-white px-3 py-2 text-xs font-medium leading-tight text-black shadow-md'>
                    <span className='block'>
                      {office.label.replace(' Office', '')}
                    </span>
                    <span className='text-[0.68rem] text-black/55'>
                      View larger map
                    </span>
                  </div>

                  <span className='absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--brand-red-500))] text-white shadow-lg'>
                    <ExternalLink className='h-4 w-4' />
                  </span>
                </div>
                <div className='space-y-3'>
                  <div>
                    <h2 className='text-lg font-semibold uppercase tracking-[0.12em] text-white'>
                      {office.label}
                    </h2>
                    <p className='mt-2 text-sm leading-6 text-white/58'>
                      {office.address}
                    </p>
                  </div>
                  <div className='grid gap-2 text-sm text-white/70'>
                    <span className='inline-flex items-center gap-2'>
                      <Phone className='h-4 w-4 text-[hsl(var(--brand-red-500))]' />
                      {office.phone}
                    </span>
                    <span className='inline-flex items-center gap-2'>
                      <Mail className='h-4 w-4 text-[hsl(var(--brand-red-500))]' />
                      {office.email}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </motion.div>

          <div className='grid overflow-hidden rounded-lg border border-white/10 bg-[hsl(var(--brand-black-800))] lg:grid-cols-[minmax(0,1.18fr)_minmax(22rem,0.82fr)]'>
            <div className='p-6 sm:p-8 lg:p-10'>
              <div className='mb-8 max-w-2xl'>
                <p className='mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[hsl(var(--brand-red-500))]'>
                  Send a Message
                </p>
                <h2 className='heading-card text-white'>
                  Tell us what you are looking for
                </h2>
                <p className='mt-3 text-sm leading-6 text-white/58'>
                  Share a few details and our consultants will connect you with
                  the right team.
                </p>
              </div>

              <form onSubmit={handleSubmit} className='space-y-5'>
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
                    <span className={inputShellClass}>
                      <Phone className={inputIconClass} />
                      <Input
                        type='tel'
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder='20xxxxxxxxxx'
                        className='border-0 bg-transparent pl-11 text-white placeholder:text-white/32 focus-visible:ring-0'
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
                      placeholder='How can we help you?'
                      rows={5}
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
            </div>

            <aside className='relative min-h-[32rem] overflow-hidden bg-[hsl(var(--brand-black))] p-6 sm:p-8 lg:p-10'>
              <img
                src={officeBuildingImage}
                alt=''
                className='absolute inset-0 h-full w-full object-cover opacity-[0.34]'
              />
              <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.45),rgba(0,0,0,0.88))]' />
              <div className='relative z-10 flex h-full flex-col justify-between gap-10'>
                <div>
                  <p className='mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[hsl(var(--brand-red-500))]'>
                    Contact Information
                  </p>
                  <h2 className='heading-card text-white'>
                    Start the conversation with Wealth Holding
                  </h2>
                  <p className='mt-3 text-sm leading-6 text-white/62'>
                    For consultations, partnerships, careers, and property
                    inquiries.
                  </p>
                </div>

                <div className='space-y-6'>
                  {contactInfo.map((item) => (
                    <div key={item.title} className='flex gap-4'>
                      <span className='flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-white/14 bg-white/[0.07] text-[hsl(var(--brand-red-500))]'>
                        <item.icon className='h-5 w-5' />
                      </span>
                      <div>
                        <h3 className='mb-1 font-semibold text-white'>
                          {item.title}
                        </h3>
                        {item.lines.map((line) => (
                          <p
                            key={line}
                            className='text-sm leading-6 text-white/62'
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className='flex items-center gap-3'>
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      aria-label={link.label}
                      title={link.label}
                      className='flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-white/[0.07] text-white/72 transition-colors hover:border-[hsl(var(--brand-red-500))] hover:text-[hsl(var(--brand-red-500))]'
                    >
                      <i
                        className={`${link.iconClass} text-[1.2rem]`}
                        aria-hidden='true'
                      />
                    </a>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
