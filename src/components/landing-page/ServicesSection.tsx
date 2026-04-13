import AnimatedPillButton from '@/components/ui/AnimatedPillButton';
import { Link, useNavigate } from 'react-router-dom';
import '@/styles/sections/ServicesSection.css';

const services = [
  {
    id: '1',
    title: 'Real Estate Development',
    desc: `Delivering residential, commercial, and mixed-use projects built with modern design, premium quality, and long-term investment potential.`,
    image:
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1800&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Investment Solutions',
    desc: `Providing tailored real estate investment opportunities that maximize returns and ensure sustainable financial growth for clients.`,
    image:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1800&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Project Planning & Design',
    desc: `Creating smart, innovative developments through strategic planning, architectural excellence, and market-driven insights.`,
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1800&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'Property Management',
    desc: `Ensuring long-term value through efficient management, maintenance, and operational excellence across all developments.`,
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1800&auto=format&fit=crop',
  },
];

type Service = (typeof services)[number];

const containerClass = 'mx-auto w-full max-w-[1440px] px-4 md:px-5 lg:px-6';

function ServiceRow({ item }: { item: Service }) {
  return (
    <Link
      to='/services'
      aria-label={`Learn more about ${item.title}`}
      className='services-row'
    >
      <div className='service-image-reveal'>
        <div className='service-image'>
          <img
            src={item.image}
            alt={item.title}
            className='service-image-inner'
          />
        </div>
        <div className='service-image-shade' />
      </div>

      <div className={`${containerClass} relative z-10`}>
        <div className='services-row-grid-layout'>
          <div className='services-row-id-cell'>
            <div>{item.id}</div>
          </div>

          <div className='services-row-copy-cell'>
            <p>{item.desc}</p>
          </div>

          <div className='services-row-title-cell'>
            <div>
              <h3>{item.title}</h3>
              <span className='service-underline' />
            </div>
          </div>

          <div className='services-row-arrow-cell'>
            <div className='service-arrow-wrap'>
              <i className='ri-arrow-right-up-line'></i>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ServicesSection() {
  const navigate = useNavigate();

  return (
    <section className='services-section'>
      <div>
        <div className='border-b border-white/10'>
          <div className={`${containerClass} py-[clamp(2.5rem,5vw,3.5rem)]`}>
            <div>
              <div className='mb-[clamp(1rem,1.8vw,1.35rem)] text-[12px] font-semibold uppercase tracking-[0.38em] text-[hsl(var(--brand-red-100))] md:text-[13px]'>
                Services
              </div>
              <h2 className='services-section-title'>
                <span className='block text-white'>Our Services</span>
                <span className='block text-white/78'>& Solutions</span>
              </h2>
            </div>
          </div>
        </div>

        {services.map((item) => (
          <ServiceRow key={item.id} item={item} />
        ))}

        <div className='py-[clamp(2.5rem,5vw,3.5rem)]'>
          <div className={containerClass}>
            <div className='services-section-wrapper'>
              <h3 className='services-closing-text'>
                <span className='text-white'>
                  We deliver comprehensive real estate
                </span>
                <br />
                <span className='text-white'>
                  solutions across every stage{' '}
                </span>
                <span className='text-white/45'>of development</span>
                <br />
                <span className='text-white/45'>and investment growth.</span>
              </h3>

              <AnimatedPillButton
                label='Explore Opportunities'
                tone='brand'
                className='services-cta-button mt-[clamp(1.5rem,3vw,2rem)] !border-0'
                labelClassName='text-sm md:text-[1vw]'
                onClick={() => navigate('/projects')}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
