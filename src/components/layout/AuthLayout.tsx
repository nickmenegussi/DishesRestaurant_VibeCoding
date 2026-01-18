import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/80 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80" 
          alt="Culinary Experience" 
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-0 left-0 p-12 z-20 text-white">
          <h2 className="text-4xl font-extrabold mb-4 leading-tight">Crafting Unforgettable<br/>Dining Experiences</h2>
          <p className="text-lg text-white/80 max-w-md">Manage your menu, track orders, and delight your customers with Global Bites.</p>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="w-full max-w-[440px] space-y-8">
           <Outlet />
        </div>
        
        {/* Mobile background accent */}
        <div className="absolute inset-0 bg-surface-background -z-10 lg:hidden" />
      </div>
    </div>
  );
}
