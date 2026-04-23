import { Link } from 'react-router-dom';
import '@/styles/sections/ServicesSection.css';

const services = [
  {
    id: '1',
    title: 'Investment-Focused Strategy',
    desc: `We build with ROI in mind, ensuring every project delivers long-term value.`,
    image:
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1800&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Strategic Locations',
    desc: `Selected based on growth potential and market demand.`,
    image:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1800&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Business-Oriented Developments',
    desc: `Designed to support commercial success and high occupancy.`,
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1800&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'Client-Centric Approach',
    desc: `Your goals drive every decision we make.`,
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

          {/* <div className='services-row-arrow-cell'>
            <div className='service-arrow-wrap'>
              <i className='ri-arrow-right-up-line'></i>
            </div>
          </div> */}
        </div>
      </div>
    </Link>
  );
}

export default function ServicesSection() {
  return (
    <section className='services-section'>
      <div>
        <div className='border-b border-white/10'>
          <div className={`${containerClass} py-[clamp(2.5rem,5vw,3.5rem)]`}>
            <div>
              {/*  <div className='mb-[clamp(1rem,1.8vw,1.35rem)] text-[12px] font-semibold uppercase tracking-[0.38em] text-[hsl(var(--brand-red-100))] md:text-[13px]'>
                Services
              </div> */}
              <h2 className='services-section-title'>
                <span className='block text-white'>What makes us </span>
                <span className='block text-white/78'>different?</span>
              </h2>
            </div>
          </div>
        </div>

        {services.map((item) => (
          <ServiceRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
