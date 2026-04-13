import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import {
  Clock,
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Visit Wealth Holding',
    lines: [
      'Ground Floor, 235 Office Building - Section 2, N Teseen, New Cairo 1, Cairo Governorate',
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
    icon: Facebook,
    label: 'Facebook',
    href: 'https://facebook.com/wealthholdingeg',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    href: 'https://instagram.com/wealthholdingeg',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/wealthholdingeg',
  },
];

const WHATSAPP_LINK =
  'https://wa.me/201090000000?text=Hello%20Wealth%20Holding%2C%20I%20have%20an%20inquiry.';

const officeLocations = [
  {
    id: 'new-cairo',
    label: 'New Cairo Office',
    address:
      'Ground Floor, 235 Office Building - Section 2, N Teseen, New Cairo 1, Cairo Governorate',
    embedUrl:
      'https://www.google.com/maps?q=Ground+Floor+235+Office+Building+Section+2+N+Teseen+New+Cairo+1+Cairo+Governorate&output=embed',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Ground+Floor+235+Office+Building+Section+2+N+Teseen+New+Cairo+1+Cairo+Governorate',
  },
  {
    id: 'sheikh-zayed',
    label: 'Sheikh Zayed Office',
    address:
      'Building 2, 6th Floor - Capital Business Park, Sheikh Zayed, Cairo, Egypt',
    embedUrl:
      'https://www.google.com/maps?q=Building+2+Capital+Business+Park+26th+of+July+Corridor+Sheikh+Zayed+City+Giza+Governorate+Egypt&output=embed',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Building+2+Capital+Business+Park+26th+of+July+Corridor+Sheikh+Zayed+City+Giza+Governorate+Egypt',
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project: '',
    message: '',
  });
  const [selectedOfficeId, setSelectedOfficeId] = useState(
    officeLocations[0].id,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const selectedOffice =
    officeLocations.find((office) => office.id === selectedOfficeId) ||
    officeLocations[0];

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
      setFormData({ name: '', email: '', phone: '', project: '', message: '' });
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
      {/* Hero Section */}
      <section className='bg-muted pt-32 pb-20'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center max-w-3xl mx-auto'
          >
            <h1 className='heading-display text-foreground mb-6'>
              Get in Touch
            </h1>
            <p className='text-body-lg text-foreground/70'>
              Ready to discuss your next investment or find your dream property?
              Our team is here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className='section-padding bg-background'>
        <div className='container-custom'>
          <div className='grid lg:grid-cols-3 gap-12'>
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='lg:col-span-1 space-y-8'
            >
              <div>
                <span className='text-secondary font-semibold tracking-wide uppercase text-sm mb-4 block'>
                  Contact Information
                </span>
                <h2 className='heading-card text-foreground'>
                  Let's Start a Conversation
                </h2>
                <p className='mt-3 text-sm text-muted-foreground'>
                  Reach out for property consultations, partnerships, or career
                  opportunities.
                </p>
              </div>

              {contactInfo.map((item) => (
                <div key={item.title} className='flex gap-4'>
                  <div className='w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center flex-shrink-0'>
                    <item.icon className='w-6 h-6 text-primary' />
                  </div>
                  <div>
                    <h4 className='font-semibold text-foreground mb-1'>
                      {item.title}
                    </h4>
                    {item.lines.map((line) => (
                      <p key={line} className='text-muted-foreground text-sm'>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              <div>
                <h4 className='mb-3 text-sm font-semibold uppercase tracking-wide text-secondary'>
                  Follow Wealth Holding
                </h4>
                <div className='flex items-center gap-3'>
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      aria-label={link.label}
                      className='flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-card text-muted-foreground transition-colors hover:text-primary'
                    >
                      <link.icon className='h-5 w-5' />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='lg:col-span-2'
            >
              <div className='bg-card p-8 rounded-sm card-elevated'>
                <h3 className='heading-card text-foreground mb-6'>
                  Send Us a Message
                </h3>
                <form onSubmit={handleSubmit} className='space-y-6'>
                  <div className='grid sm:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-foreground mb-2'>
                        Full Name *
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder='Your full name'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-foreground mb-2'>
                        Email *
                      </label>
                      <Input
                        type='email'
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder='your@email.com'
                      />
                    </div>
                  </div>

                  <div className='grid sm:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-foreground mb-2'>
                        Phone *
                      </label>
                      <Input
                        type='tel'
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder='20xxxxxxxxxx'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-foreground mb-2'>
                        Project of Interest
                      </label>
                      <Input
                        value={formData.project}
                        onChange={(e) =>
                          setFormData({ ...formData, project: e.target.value })
                        }
                        placeholder='e.g. Once Mall'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-foreground mb-2'>
                      Message *
                    </label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder='How can we help you?'
                      rows={5}
                    />
                  </div>

                  <Button
                    type='submit'
                    size='lg'
                    className='w-full sm:w-auto'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className='bg-muted py-14'>
        <div className='container-custom'>
          <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
            <div>
              <h3 className='heading-card text-foreground'>
                Visit Our Offices
              </h3>
              <p className='mt-1 text-sm text-muted-foreground'>
                Select a branch to view directions.
              </p>
            </div>
            <div className='flex flex-wrap gap-2'>
              {officeLocations.map((office) => (
                <button
                  key={office.id}
                  type='button'
                  onClick={() => setSelectedOfficeId(office.id)}
                  className={`rounded-sm border px-3 py-2 text-sm transition-colors ${
                    selectedOfficeId === office.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-foreground hover:border-primary/50'
                  }`}
                >
                  {office.label}
                </button>
              ))}
            </div>
          </div>

          <div className='grid gap-4 lg:grid-cols-4'>
            <div className='rounded-sm border border-border bg-card p-4 lg:col-span-1'>
              <div className='mb-2 flex items-center gap-2 text-sm font-semibold text-secondary'>
                <MapPin className='h-4 w-4' />
                {selectedOffice.label}
              </div>
              <p className='mb-4 text-sm text-muted-foreground'>
                {selectedOffice.address}
              </p>
              <a
                href={selectedOffice.mapsUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline'
              >
                Open in Google Maps
                <ExternalLink className='h-4 w-4' />
              </a>
            </div>

            <div className='overflow-hidden rounded-sm border border-border bg-card lg:col-span-3'>
              <iframe
                key={selectedOffice.id}
                title={`${selectedOffice.label} map`}
                src={selectedOffice.embedUrl}
                loading='lazy'
                className='h-[420px] w-full'
                referrerPolicy='no-referrer-when-downgrade'
              />
            </div>
          </div>
        </div>
      </section>

      <a
        href={WHATSAPP_LINK}
        target='_blank'
        rel='noopener noreferrer'
        aria-label='Chat with Wealth Holding on WhatsApp'
        className='fixed right-5 bottom-5 z-50 inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-green-700'
      >
        <MessageCircle className='h-5 w-5' />
        WhatsApp
      </a>
    </Layout>
  );
};

export default Contact;
