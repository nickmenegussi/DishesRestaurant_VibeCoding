
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-text-main mb-4">
               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                 <span className="font-black">G</span>
               </div>
               Global Bites
            </Link>
            <p className="text-text-muted text-sm leading-relaxed mb-6">
              Experience the world's finest flavors delivered to your doorstep. Ethically sourced, expertly crafted.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 text-text-muted hover:bg-primary hover:text-white transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 text-text-muted hover:bg-primary hover:text-white transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 text-text-muted hover:bg-primary hover:text-white transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-text-main mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><Link to="/menu" className="hover:text-primary transition-colors">Our Menu</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/locations" className="hover:text-primary transition-colors">Locations</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-text-main mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h4 className="font-bold text-text-main mb-4">Stay Updated</h4>
            <p className="text-text-muted text-sm mb-4">Subscribe to get seasonal menu updates and exclusive offers.</p>
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); }}>
               <div className="relative flex-1">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                 <input 
                   type="email" 
                   placeholder="Your email" 
                   className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                   required
                 />
               </div>
               <Button size="sm" type="submit">Join</Button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 text-center text-sm text-text-muted">
          <p>© {new Date().getFullYear()} Global Bites Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
