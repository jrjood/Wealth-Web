import AnimatedPillButton from '@/components/ui/AnimatedPillButton';
import { useNavigate } from 'react-router-dom';

const EarlyAdopterSection = () => {
  const navigate = useNavigate();

  return (
    <section
      id='page13'
      className='relative flex min-h-[52vh] w-screen flex-col justify-center bg-brand-black-900 px-6 py-12 text-white sm:min-h-[56vh] sm:py-14 md:min-h-[80vh] md:px-10 md:py-20 lg:px-16'
    >
      <h1 className='text-5xl font-light leading-none sm:text-6xl md:text-7xl lg:text-8xl'>
        Become an
        <br />
        early adopter
      </h1>

      <AnimatedPillButton
        label='Request a Consultation'
        tone='brand'
        className='book-a-demo2 mt-7 w-fit self-start !border-0 md:mt-10'
        labelClassName='text-sm md:text-base'
        onClick={() => navigate('/contact')}
      />
    </section>
  );
};

export default EarlyAdopterSection;
