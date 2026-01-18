import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../../utils/cn";

const SLIDES = [
  {
    title: <>The Perfect Space to <br /> Enjoy Fantastic Food</>,
    description: "Festive dining at extraordinary prices. So come, dining in classic contemporary style and palate.",
    image: "https://imgs.search.brave.com/8EpFMRzPhPuL_caHdFS6IvwRqI_0qOuimVr2ySEt4JE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTE3/NzA5OTk1MC9waG90/by9oaWdoLWVuZC1w/bGF0ZWQtZm9vZC1k/aXNoLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz1faUxtT29O/WWJqTzhrMlFnNkdO/YXoxRHhQQVdMUWh1/YXRCT1UxNnlhUWZV/PQ",
    dishName: "Steak au Poivre",
    price: "$24.99"
  },
  {
    title: <>Authentic Flavors <br /> From the Hearth</>,
    description: "Experience the real taste of wood-fired specialties made with love and traditional recipes.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    dishName: "Italian Pizza",
    price: "$18.50"
  },
  {
    title: <>Fresh Ingredients <br /> Masterfully Prepared</>,
    description: "Our chefs select only the finest seasonal produce to create healthy and vibrant creations.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    dishName: "Buddha Bowl",
    price: "$16.00"
  }
];

export function HeroSection() {
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const handlePrev = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  const handleOpenVideo = () => {
    setIsVideoModalOpen(true);
  };

  const handleCloseVideo = () => {
    setIsVideoModalOpen(false);
  };

  return (
    <>
      {isVideoModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300"
          onClick={handleCloseVideo}
        >
          <div 
            className="relative w-full max-w-4xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão de fechar */}
            <button
              onClick={handleCloseVideo}
              className="absolute -top-10 right-0 text-white hover:text-primary transition-colors z-10"
              aria-label="Fechar vídeo"
            >
              <X className="h-8 w-8" />
            </button>
            
            {/* Container do vídeo */}
            <div className="relative pt-[56.25%] bg-black rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src="https://www.youtube.com/embed/2PuFyjAs7JA?autoplay=1&rel=0&modestbranding=1"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      <div className="relative bg-secondary overflow-hidden min-h-[600px] flex items-center group/hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left animate-fadeIn">
              <div key={currentSlide} className="animate-in slide-in-from-left-4 fade-in duration-700">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-tight">
                  {SLIDES[currentSlide].title}
                </h1>
                <p className="mt-6 text-lg text-gray-400 max-w-lg">
                  {SLIDES[currentSlide].description}
                </p>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Button 
                  className="h-14 px-8 rounded-full text-lg font-bold bg-primary hover:bg-primary-hover border-none"
                  onClick={() => navigate('/menu')}
                >
                  Service Menu
                </Button>
                <div 
                  className="flex items-center gap-3 group cursor-pointer"
                  onClick={handleOpenVideo}
                >
                  <div className="h-12 w-12 rounded-full border-2 border-gray-600 flex items-center justify-center group-hover:border-primary transition-colors">
                    <Play className="h-5 w-5 text-white ml-1" fill="currentColor" />
                  </div>
                  <span className="text-white font-medium">Video</span>
                </div>
              </div>
              
              {/* Dots Indicator */}
              <div className="mt-12 flex gap-3">
                {SLIDES.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={cn(
                            "h-2 transition-all duration-300 rounded-full",
                            currentSlide === idx ? "w-8 bg-accent" : "w-2 bg-gray-600 hover:bg-gray-400"
                        )}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
              </div>
            </div>

            <div className="relative lg:h-full flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px]">
                {/* Main Plate */}
                <div key={currentSlide} className="animate-in zoom-in-95 fade-in duration-1000">
                  <img 
                    src={SLIDES[currentSlide].image} 
                    alt={SLIDES[currentSlide].dishName} 
                    className="w-[450px] h-[450px] object-cover rounded-full border-[12px] border-gray-800/50 shadow-2xl relative z-10"
                  />
                  
                  {/* Floating Elements (Background decorations) */}
                  <div className="absolute -top-6 -right-6 hidden lg:block animate-float z-20">
                    <img 
                      src="https://images.unsplash.com/photo-1546271876-af6caec5fae5?auto=format&fit=crop&w=150&q=80" 
                      className="w-24 h-24 rounded-full border-4 border-gray-800 object-cover shadow-xl" 
                      alt="decoration" 
                    />
                  </div>

                  <div className="absolute -bottom-4 -left-4 hidden lg:block animate-float z-20" style={{ animationDelay: '1.5s' }}>
                    <img 
                      src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=150&q=80" 
                      className="w-20 h-20 rounded-full border-4 border-gray-800 object-cover shadow-xl" 
                      alt="decoration" 
                    />
                  </div>
                  
                  {/* Price/Rating Badge */}
                  <div className="absolute bottom-10 right-0 bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl z-20 min-w-[180px] animate-in slide-in-from-right-8 duration-700">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-black text-sm tracking-tight">{SLIDES[currentSlide].dishName}</span>
                      <span className="text-accent font-bold text-xs">{SLIDES[currentSlide].price}</span>
                    </div>
                    <div className="flex text-accent text-[10px] tracking-widest">
                      ★★★★★
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 flex justify-between px-4 opacity-0 group-hover/hero:opacity-100 transition-opacity duration-300">
           <button 
             onClick={handlePrev}
             className="h-12 w-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary transition-all active:scale-95"
           >
             <ChevronLeft className="h-6 w-6" />
           </button>
           <button 
             onClick={handleNext}
             className="h-12 w-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary transition-all active:scale-95"
           >
             <ChevronRight className="h-6 w-6" />
           </button>
        </div>
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(253,197,94,0.05),transparent_40%)]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/50 to-transparent pointer-events-none" />
      </div>
    </>
  );
}