import { BadgeDollarSign, CalendarRange, Landmark } from 'lucide-react';

interface PaymentPlan {
  id: string;
  downPayment: string;
  installments: string;
  startingPrice: string;
}

interface PaymentPlanCardProps {
  paymentPlan: PaymentPlan | null;
}

export const PaymentPlanCard = ({ paymentPlan }: PaymentPlanCardProps) => {
  if (!paymentPlan) {
    return null;
  }

  const planItems = [
    {
      label: 'Down Payment',
      value: paymentPlan.downPayment,
      icon: BadgeDollarSign,
    },
    {
      label: 'Installments',
      value: paymentPlan.installments,
      icon: CalendarRange,
    },
    {
      label: 'Starting Price',
      value: paymentPlan.startingPrice,
      icon: Landmark,
    },
  ];

  return (
    <section className='relative min-w-0 overflow-hidden bg-[hsl(var(--brand-black-800))] px-4 py-7 sm:px-8 sm:py-9 lg:px-10'>
      <div className='mb-7 grid min-w-0 gap-4 md:grid-cols-[minmax(0,0.65fr)_minmax(0,0.35fr)] md:items-end'>
        <div className='min-w-0'>
          <p className='mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/55'>
            Commercial Terms
          </p>
          <h2 className='break-words text-3xl font-bold uppercase tracking-[0.08em] text-[hsl(var(--brand-gold))] sm:text-4xl md:text-5xl'>
            Payment Plan
          </h2>
        </div>
      </div>

      <div className='grid min-w-0 border-y border-white/12 md:grid-cols-3'>
        {planItems.map((item, index) => (
          <article
            key={item.label}
            className='group relative min-h-48 min-w-0 border-b border-white/12 p-5 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[hsl(var(--brand-gold)/0.55)] hover:bg-white/[0.055] hover:shadow-[0_1.5rem_3.5rem_rgba(0,0,0,0.28)] sm:min-h-56 sm:p-6 md:border-b-0 md:border-r md:last:border-r-0'
          >
            <div className='mb-12 flex items-center justify-between gap-4'>
              <span className='flex h-12 w-12 items-center justify-center border border-[hsl(var(--brand-gold)/0.55)] text-[hsl(var(--brand-gold))] transition-all duration-500 ease-out group-hover:scale-110 group-hover:bg-[hsl(var(--brand-gold))] group-hover:text-[hsl(var(--brand-black))]'>
                <item.icon className='h-5 w-5 transition-transform duration-500 ease-out group-hover:rotate-[-8deg]' />
              </span>
              <span className='text-sm font-semibold tabular-nums text-white/35 transition-colors duration-500 group-hover:text-[hsl(var(--brand-gold))]'>
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            <p className='mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/48 transition-colors duration-500 group-hover:text-white/68'>
              {item.label}
            </p>
            <p className='break-words text-2xl font-semibold leading-tight text-white transition-transform duration-500 ease-out group-hover:translate-x-1 sm:text-3xl xl:text-4xl'>
              {item.value}
            </p>
            <span className='absolute bottom-0 left-6 h-px w-16 bg-[hsl(var(--brand-gold))] transition-all duration-500 ease-out group-hover:w-28 group-hover:shadow-[0_0_1rem_hsl(var(--brand-gold)/0.45)]' />
          </article>
        ))}
      </div>
    </section>
  );
};
