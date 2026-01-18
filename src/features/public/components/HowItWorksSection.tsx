
import { Search, MousePointerClick, Truck } from "lucide-react";

const steps = [
    {
        title: "Explore Menu",
        desc: "Browse our diverse menu to find your craving.",
        icon: Search
    },
    {
        title: "Choose a Dish",
        desc: "customize your meal and add to cart.",
        icon: MousePointerClick
    },
    {
        title: "Place Order",
        desc: "Relax while we prepare and deliver your food.",
        icon: Truck
    }
]

export function HowItWorksSection() {
    return (
        <section className="relative bg-primary py-24 overflow-hidden">
             <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5 opacity-50 blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/5 opacity-50 blur-3xl"></div>
             </div>

             <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                <h2 className="text-sm font-bold tracking-widest uppercase opacity-90 mb-2">Easy Steps</h2>
                <h3 className="text-4xl font-extrabold mb-16">How We Work</h3>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-white/30"></div>

                    {steps.map((step, idx) => (
                        <div key={idx} className="relative flex flex-col items-center">
                            <div className="h-24 w-24 rounded-full bg-accent text-primary flex items-center justify-center shadow-lg mb-6 border-4 border-white/20">
                                <step.icon className="h-10 w-10" />
                                <div className="absolute -top-2  h-8 w-8 rounded-full bg-white text-primary flex items-center justify-center font-bold text-sm shadow-sm">
                                    {idx + 1}
                                </div>
                            </div>
                            <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                            <p className="text-white/80 max-w-xs">{step.desc}</p>
                        </div>
                    ))}
                </div>
             </div>
        </section>
    )
}
