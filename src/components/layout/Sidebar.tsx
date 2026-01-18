import { LayoutDashboard, Menu, ShoppingBag, Settings, LogOut, X, TrendingUp } from "lucide-react";
import { cn } from "../../utils/cn";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function LogoutButton() {
  const { logout } = useAuth();
  return (
    <button 
      onClick={logout}
      className="group flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
    >
      <LogOut className="mr-3 h-5 w-5" />
      Logout
    </button>
  );
}

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { name: 'Reports', icon: TrendingUp, href: '/admin/reports' },
  { name: 'Menu', icon: Menu, href: '/admin/menu' },
  { name: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
  { name: 'Settings', icon: Settings, href: '/admin/settings' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:transition-none overflow-y-auto custom-scrollbar",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 font-bold text-xl text-text-main">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Menu className="h-5 w-5" />
            </div>
            Global Bites
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-text-muted hover:bg-gray-100 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
      
      <div className="flex flex-1 flex-col justify-between px-4 py-6">
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => cn(
                "group flex items-center rounded-xl px-3 py-2.5 text-sm font-bold transition-all hover:bg-white hover:shadow-sm",
                isActive ? "bg-white text-primary shadow-sm ring-1 ring-black/5" : "text-text-muted/70 hover:text-text-main"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-text-muted group-hover:text-text-main"
                    )}
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-100 pt-4">
           {/* We can import useAuth or pass logout prop, but let's wire it up properly next */}
           <LogoutButton />
        </div>
      </div>
      </div>
    </>
  );
}
