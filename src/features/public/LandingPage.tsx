
import { HeroSection } from "./components/HeroSection";
import { ServicesSection } from "./components/ServicesSection";
import { PopularDishesSection } from "./components/PopularDishesSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { AppDownloadSection } from "./components/AppDownloadSection";
import { TestimonialsSection } from "./components/TestimonialsSection";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <HeroSection />
      
      <ServicesSection />
      
      <HowItWorksSection />

      <PopularDishesSection />

      <TestimonialsSection />

      <AppDownloadSection />

    </div>
  );
}
