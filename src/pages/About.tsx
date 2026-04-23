import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import ValuesSection from '@/components/landing-page/ValuesSection';
import useGsapAnimations from '@/hooks/useGsapAnimations';
import { Target, Award } from 'lucide-react';
import owner1 from '@/assets/images/owner1.jpg';
import owner2 from '@/assets/images/owner2.jpg';

const milestones = [
  {
    year: '2002',
    title: 'A Legacy Begins',
    description:
      'Wealth Holding began its journey in construction and development, building on long-term experience, shared values, and a vision for lasting impact.',
  },
  {
    year: 'Growth Phase',
    title: 'Portfolio Expansion',
    description:
      'The company expanded across mixed-use and investment-driven developments, with a growing presence in commercial, administrative, medical, and residential real estate.',
  },
  {
    year: 'New Cairo',
    title: 'Mixed-Use Destinations',
    description:
      'Wealth Holding strengthened its footprint through projects in strategic locations, including developments in New Cairo that support business growth and everyday convenience.',
  },
  {
    year: 'New Capital',
    title: 'Regional Presence',
    description:
      'Its portfolio extended into landmark destinations such as the New Administrative Capital, reflecting a broader vision for smart, high-value urban development.',
  },
  {
    year: '2025',
    title: 'Brand Evolution',
    description:
      'Wealth Holding introduced a renewed brand direction that reflects its ambition, legacy, and investment-led approach to modern real estate development.',
  },
  {
    year: '2026',
    title: 'Citra Residence Launch',
    description:
      'The company launched Citra Residence in New Sheikh Zayed as a major residential development, reinforcing its expansion into integrated communities and long-term value creation.',
  },
];

const leadership = [
  {
    name: 'Mohamed Mamdouh',
    role: 'Owner',
    image: owner1,
    description:
      'Leads Wealth Holding with a long-term development vision focused on strategic growth, quality execution, and lasting investment value.',
  },
  {
    name: 'Eng. Sohir Koriem',
    role: 'Owner',
    image: owner2,
    description:
      'Brings engineering-driven leadership and deep market insight to deliver integrated real estate destinations across prime locations.',
  },
];

const About = () => {
  useGsapAnimations();

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
              Building Legacy Through Real Estate
            </h1>
            <p className='text-body-lg text-foreground/80'>
              Since 2002, Wealth Holding has been shaping high-value
              developments that combine strategic vision, quality execution, and
              long-term investment potential.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className='section-padding bg-background'>
        <div className='container-custom'>
          <div className='grid md:grid-cols-2 gap-12'>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='p-8 bg-card rounded-sm card-elevated'
            >
              <div className='mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-primary/25 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent shadow-[0_10px_24px_-12px_hsl(var(--brand-black)_/_0.7)] ring-1 ring-primary/10 transition-transform duration-300 group-hover:scale-[1.04]'>
                <Target
                  className='h-7 w-7 text-primary drop-shadow-[0_2px_6px_hsl(var(--brand-black)_/_0.35)]'
                  strokeWidth={2.2}
                />
              </div>
              <h3 className='heading-card text-foreground mb-4'>Our Mission</h3>
              <p className='text-muted-foreground text-body'>
                To develop real estate destinations that create meaningful value
                through smart planning, strong locations, and quality-driven
                execution that serves both lifestyle needs and investment goals.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='p-8 bg-card rounded-sm card-elevated'
            >
              <div className='mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-secondary/30 bg-gradient-to-br from-secondary/22 via-secondary/12 to-transparent shadow-[0_10px_24px_-12px_hsl(var(--brand-black)_/_0.7)] ring-1 ring-secondary/10 transition-transform duration-300 group-hover:scale-[1.04]'>
                <Award
                  className='h-7 w-7 text-secondary drop-shadow-[0_2px_6px_hsl(var(--brand-black)_/_0.35)]'
                  strokeWidth={2.2}
                />
              </div>
              <h3 className='heading-card text-foreground mb-4'>Our Vision</h3>
              <p className='text-muted-foreground text-body'>
                To be a leading name in real estate development by building
                projects that reflect legacy, inspire confidence, and generate
                sustainable growth across Egypt’s most promising destinations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <ValuesSection />

      {/* Timeline */}
      <section className='section-padding bg-muted'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <span className='text-secondary font-semibold tracking-wide uppercase text-sm mb-4 block'>
              Our Journey
            </span>
            <h2 className='heading-section text-foreground'>
              Milestones That Reflect Our Growth
            </h2>
          </motion.div>

          <div className='relative'>
            <div className='absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block' />

            <div className='space-y-12'>
              {milestones.map((milestone, index) => (
                <motion.div
                  key={`${milestone.year}-${milestone.title}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative grid md:grid-cols-2 gap-8 ${
                    index % 2 === 0 ? '' : 'md:text-right'
                  }`}
                >
                  <div
                    className={`${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}
                  >
                    <div
                      className={`p-6 bg-card rounded-sm card-elevated ${
                        index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'
                      }`}
                    >
                      <span className='text-primary font-bold text-lg'>
                        {milestone.year}
                      </span>
                      <h4 className='font-semibold text-foreground mt-2 mb-2'>
                        {milestone.title}
                      </h4>
                      <p className='text-muted-foreground text-sm'>
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`hidden md:block ${
                      index % 2 === 0 ? 'md:order-2' : 'md:order-1'
                    }`}
                  />

                  <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full hidden md:block' />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Company Focus */}
      <section className='section-padding bg-background'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <span className='text-secondary font-semibold tracking-wide uppercase text-sm mb-4 block'>
              Leadership
            </span>
            <h2 className='heading-section text-foreground'>Meet Our Owners</h2>
          </motion.div>

          <div className='grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto'>
            {leadership.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className='group'
              >
                <div className='aspect-[4/5] bg-muted rounded-sm mb-4 overflow-hidden shadow-[0_4px_24px_-4px_hsl(0_0%_0%_/_0.08)] hover:shadow-[0_12px_40px_-8px_hsl(0_0%_0%_/_0.15)] transition-shadow duration-300'>
                  <img
                    src={item.image}
                    alt={item.name}
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                  />
                </div>
                <h4 className='font-semibold text-foreground'>{item.name}</h4>
                <p className='text-primary text-sm font-medium mb-2'>
                  {item.role}
                </p>
                <p className='text-muted-foreground text-sm'>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
