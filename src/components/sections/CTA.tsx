import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CTA = () => {
  return (
    <section className="section-padding bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 md:w-96 md:h-96 bg-primary-foreground rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-primary-foreground rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="heading-section text-primary-foreground mb-6">
            Ready to Invest in Your Future?
          </h2>
          <p className="text-body-lg text-primary-foreground/90 mb-10 leading-relaxed">
            Whether you're looking for your dream home or a strategic investment 
            opportunity, our team is here to guide you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button 
                variant="heroOutline" 
                size="lg"
                className="group border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary w-full sm:w-auto"
              >
                Schedule a Consultation
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="tel:+9714123456">
              <Button 
                variant="ghost" 
                size="lg"
                className="text-primary-foreground hover:bg-primary-foreground/10 border-2 border-transparent hover:border-primary-foreground/20 w-full sm:w-auto"
              >
                <Phone className="w-5 h-5" />
                +971 4 123 4567
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
