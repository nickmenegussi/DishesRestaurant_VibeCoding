import { Outlet, Link } from "react-router-dom";
import { Menu, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";

import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";
import { AIChefAssistant } from "../../features/public/components/AIChefAssistant";
import { Footer } from "./Footer";

export function PublicLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  return (
    <div className="min-h-screen w-full bg-surface-background overflow-x-hidden">
      <header className="sticky top-0 z-[999] flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-text-main">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Menu className="h-5 w-5" />
          </div>
          Global Bites
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-muted">
          <Link to="/" className="hover:text-text-main transition-colors">Home</Link>
          <Link to="/menu" className="hover:text-text-main transition-colors">Menus</Link>
          <Link to="/favorites" className="hover:text-text-main transition-colors">Favorites</Link>
          <Link to="/about" className="hover:text-text-main transition-colors">About Us</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative p-2 text-text-muted hover:text-primary transition-colors">
            <ShoppingBag className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {totalItems}
              </span>
            )}
          </Link>
          <div className="h-6 w-px bg-gray-200" />
          {isAuthenticated ? (
             <div className="flex items-center gap-4">
               <span className="text-sm font-medium text-text-main hidden sm:inline-block">
                 Welcome, {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Guest'}
               </span>
               <Link to="/admin/dashboard">
                  <Button variant="secondary" size="sm">Dashboard</Button>
               </Link>
               <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
             </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/auth/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <Footer />
      <AIChefAssistant />
    </div>
  );
}
