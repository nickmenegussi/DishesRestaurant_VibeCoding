
import { Truck, Star, ShieldCheck } from "lucide-react";

const features = [
  {
    name: 'Fast Delivery',
    description: 'We ensure your food arrives hot and fresh, as quickly as possible.',
    icon: Truck,
  },
  {
    name: 'Top Quality',
    description: 'We use only the finest ingredients to create unforgettable dishes.',
    icon: Star,
  },
  {
    name: 'Freshly Prepared',
    description: 'Every meal is made to order by our expert chefs.',
    icon: ShieldCheck,
  },
];

export function FeaturesSection() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Why Choose Us</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-text-main sm:text-4xl">
            A better way to eat
          </p>
          <p className="mt-4 max-w-2xl text-xl text-text-muted lg:mx-auto">
            Experience the difference with our commitment to quality, speed, and taste.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-text-main">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-text-muted">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
