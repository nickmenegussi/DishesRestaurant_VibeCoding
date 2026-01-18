
import { Button } from "../../../components/ui/Button";

export function AppDownloadSection() {
    return (
        <section className="bg-white py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    <div className="relative">
                        <div className="relative mx-auto w-full max-w-[500px]">
                            <div className="absolute inset-0 bg-primary/5 rounded-full filter blur-3xl scale-95"></div>
                            
                            <img 
                                src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=600&q=80" 
                                alt="Mobile App Experience" 
                                className="relative w-full h-auto rounded-3xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                            />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg text-primary font-bold uppercase mb-4">Mobile App</h2>
                        <h3 className="text-4xl font-extrabold text-text-main mb-6 leading-tight">
                            Perfect Place For An <br/> Exceptional Experience
                        </h3>
                        <p className="text-text-muted text-lg mb-8 leading-relaxed">
                            Order on the go with our mobile app. Get exclusive deals, track your delivery in real-time, and enjoy a seamless ordering experience.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                             <Button className="h-14 px-8 rounded-full bg-black hover:bg-gray-800 text-white flex items-center gap-3">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.5 13H21v5.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5V5.5A2.5 2.5 0 0 1 5.5 3H9v3.5H5.5v12h13V13zm-3.5-6h-3V5h3V2h2.5v3h3v2.5h-3v3H14v-3z"/></svg>
                                <div>
                                    <span className="block text-xs font-light">Download on the</span>
                                    <span className="block text-lg font-bold leading-none">App Store</span>
                                </div>
                             </Button>
                             <Button className="h-14 px-8 rounded-full bg-black hover:bg-gray-800 text-white flex items-center gap-3">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/></svg>
                                <div>
                                    <span className="block text-xs font-light">Get it on</span>
                                    <span className="block text-lg font-bold leading-none">Google Play</span>
                                </div>
                             </Button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
