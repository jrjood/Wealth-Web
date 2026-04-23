import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import {
  Building2,
  Home,
  Landmark,
  Briefcase,
  Wrench,
  Users,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { CTA } from '@/components/sections/CTA';

const services = [
  {
    icon: Building2,
    title: 'Residential Development',
    image:
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Modern residential apartment buildings',
    description:
      'We develop residential communities designed around quality, comfort, and long-term value, creating destinations that support modern living and sustainable investment growth.',
    features: [
      'Integrated communities',
      'Modern residential concepts',
      'Lifestyle-driven planning',
      'Long-term value creation',
    ],
  },
  {
    icon: Landmark,
    title: 'Commercial & Mixed-Use Development',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Modern commercial office tower',
    description:
      'Our developments combine commercial, administrative, medical, and mixed-use spaces in strategic locations that serve business needs and enhance investment potential.',
    features: [
      'Commercial spaces',
      'Administrative units',
      'Medical units',
      'Mixed-use destinations',
    ],
  },
  {
    icon: Briefcase,
    title: 'Investment Solutions',
    image:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Financial analysis and investment planning on a desk',
    description:
      'We create real estate opportunities shaped by market demand, location strength, and future growth potential to support smarter investment decisions and sustainable returns.',
    features: [
      'Strategic opportunities',
      'Investment-focused projects',
      'Market-driven planning',
      'Sustainable growth potential',
    ],
  },
  {
    icon: Wrench,
    title: 'Project Planning & Development',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Architectural plans and development coordination',
    description:
      'From concept to execution, we approach every project with careful planning, design coordination, and a strong commitment to delivering developments with lasting impact.',
    features: [
      'Development strategy',
      'Design coordination',
      'Execution oversight',
      'Quality-focused delivery',
    ],
  },
  {
    icon: Home,
    title: 'Property Management',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Premium interior representing property management',
    description:
      'Where applicable, we support the long-term performance of developments through efficient operational management that helps preserve quality, functionality, and asset value.',
    features: [
      'Operational efficiency',
      'Asset value support',
      'Maintenance coordination',
      'Long-term performance',
    ],
  },
];

const Services = () => {
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
              Our Services
            </h1>
            <p className='text-body-lg text-foreground/70'>
              Real estate solutions built around development excellence,
              strategic investment value, and destinations designed for lasting
              growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className='section-padding bg-background'>
        <div className='container-custom'>
          <div className='space-y-20'>
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className='w-16 h-16 bg-primary/10 rounded-sm flex items-center justify-center mb-6'>
                    <service.icon className='w-8 h-8 text-primary' />
                  </div>
                  <h2 className='heading-section text-foreground mb-4'>
                    {service.title}
                  </h2>
                  <p className='text-muted-foreground text-body-lg mb-8'>
                    {service.description}
                  </p>
                  <ul className='grid sm:grid-cols-2 gap-3'>
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className='flex items-center gap-2 text-foreground'
                      >
                        <div className='w-2 h-2 bg-primary rounded-full' />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className='aspect-[4/3] bg-muted rounded-sm overflow-hidden shadow-[0_4px_24px_-4px_hsl(0_0%_0%_/_0.08)]'>
                    <img
                      src={service.image}
                      alt={service.imageAlt}
                      className='h-full w-full object-cover transition-transform duration-700 hover:scale-105'
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className='section-padding bg-muted'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <span className='text-secondary font-semibold tracking-wide uppercase text-sm mb-4 block'>
              Our Approach
            </span>
            <h2 className='heading-section text-foreground'>
              Why Work With Us
            </h2>
          </motion.div>

          <div className='grid md:grid-cols-3 gap-8'>
            {[
              {
                icon: Shield,
                title: 'Built on Trust',
                description:
                  'We approach every development with transparency, commitment, and a focus on creating confidence for clients, partners, and investors.',
              },
              {
                icon: TrendingUp,
                title: 'Value-Driven Vision',
                description:
                  'Our projects are shaped to deliver real market relevance, strong positioning, and long-term value across every stage of development.',
              },
              {
                icon: Users,
                title: 'Human-Centered Development',
                description:
                  'We create destinations that balance investment opportunity with practical user needs, lifestyle quality, and future community growth.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className='p-8 bg-card rounded-sm card-elevated text-center'
              >
                <div className='w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <item.icon className='w-7 h-7 text-primary' />
                </div>
                <h3 className='heading-card text-foreground mb-4'>
                  {item.title}
                </h3>
                <p className='text-muted-foreground'>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </Layout>
  );
};

export default Services;
