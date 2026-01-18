
import { Coffee, Wine, Truck, Store } from "lucide-react";

const services = [
  {
    name: 'Afternoon Tea',
    description: 'Relax with our premium selection of teas and pastries.',
    icon: Coffee,
  },
  {
    name: 'Wine & Cocktails',
    description: 'Expertly curated wine list and signature cocktails.',
    icon: Wine,
  },
  {
    name: 'Takeaway & Delivery',
    description: 'Enjoy our delicious food in the comfort of your home.',
    icon: Truck,
  },
  {
    name: 'Alfresco Dining',
    description: 'Dine under the stars in our beautiful outdoor patio.',
    icon: Store,
  },
];

export function ServicesSection() {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="order-2 lg:order-1">
                 <div className="mb-12">
                    <h2 className="text-lg text-primary font-bold tracking-wide uppercase mb-2">Food Services</h2>
                    <h3 className="text-4xl font-extrabold text-text-main leading-tight">
                        We Provide Best <br/> Services
                    </h3>
                 </div>

                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-12">
                    {services.map((service) => (
                    <div key={service.name} className="relative">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-accent/20 text-accent mb-4 border border-accent/20">
                            <service.icon className="h-8 w-8" strokeWidth={1.5} />
                        </div>
                        <h4 className="text-lg font-bold text-text-main mb-2">{service.name}</h4>
                        <p className="text-sm text-text-muted leading-relaxed">
                            {service.description}
                        </p>
                    </div>
                    ))}
                </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center">
                 <div className="relative">
                  <div className="relative">
                     <img 
                        src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80" 
                        alt="Service Composite" 
                        className="w-full max-w-md rounded-full shadow-xl rotate-12"
                     />
                 </div>
            </div>

        </div>
      </div>
    </div>
    </div>
  );
}
