
import { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "../../../utils/cn";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Food Blogger",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    content: "The variety of dishes available is simply astounding. Each meal feels like a journey to a new country. Absolutely love the attention to detail!",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Regular Customer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    content: "Fast delivery, hot food, and incredible flavors. The 'Spicy Szechuan Chicken' is a must-try. I order at least twice a week!",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Davis",
    role: "Chef",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    content: "As a chef myself, I appreciate the quality of ingredients used here. You can really taste the freshness in every bite.",
    rating: 4,
  },
  {
    id: 4,
    name: "David Wilson",
    role: "Foodie",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    content: "Global Bites has completely changed my lunch breaks. Healthy, delicious, and affordable options right at my fingertips.",
    rating: 5,
  },
  {
    id: 5,
    name: "Jessica Taylor",
    role: "Marketing Director",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    content: "The user interface is so smooth and easy to use. Ordering food has never been this enjoyable. Highly recommended!",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
    }
    return 1;
  };

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());

  useEffect(() => {
    const handleResize = () => setItemsPerView(getItemsPerView());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(TESTIMONIALS.length / itemsPerView);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, totalSlides]);

  const visibleTestimonials = [];
  for (let i = 0; i < itemsPerView; i++) {
    const index = (activeIndex * itemsPerView + i) % TESTIMONIALS.length;
    visibleTestimonials.push(TESTIMONIALS[index]);
  }

  return (
    <section className="bg-gray-50 py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-text-main sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-lg text-text-muted max-w-2xl mx-auto">
            Don't just take our word for it. Here's what food lovers from around the world have to say about their Global Bites experience.
          </p>
        </div>

        <div 
            className="relative"
            onMouseEnter={() => setIsAutoPlaying(false)} 
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleTestimonials.map((testimonial) => (
              <div 
                key={`${testimonial.id}-${activeIndex}`}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col h-full transition-all duration-500 hover:shadow-md animate-fadeIn"
              >
                <div className="flex items-center gap-1 text-yellow-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                        key={i} 
                        className={cn("h-4 w-4", i < testimonial.rating ? "fill-current" : "text-gray-200 fill-gray-200")} 
                    />
                  ))}
                </div>
                
                <div className="mb-6 relative">
                    <Quote className="h-8 w-8 text-primary/20 absolute -top-2 -left-2 transform -scale-x-100" />
                    <p className="text-text-main italic relative pl-4">{testimonial.content}</p>
                </div>

                <div className="mt-auto flex items-center gap-4 pt-6 border-t border-gray-50">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100"
                  />
                  <div>
                    <h4 className="font-bold text-text-main text-sm">{testimonial.name}</h4>
                    <span className="text-xs text-text-muted">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-8 mt-12">
            <button 
                onClick={prevSlide}
                className="p-3 rounded-full bg-white border border-gray-200 text-text-muted hover:text-primary hover:border-primary transition-colors shadow-sm"
                aria-label="Previous testimonial"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="flex gap-2">
                {[...Array(totalSlides)].map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={cn(
                            "h-2 rounded-full transition-all duration-300",
                            activeIndex === idx ? "w-8 bg-primary" : "w-2 bg-gray-200 hover:bg-gray-300"
                        )}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>

            <button 
                onClick={nextSlide}
                className="p-3 rounded-full bg-white border border-gray-200 text-text-muted hover:text-primary hover:border-primary transition-colors shadow-sm"
                aria-label="Next testimonial"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
