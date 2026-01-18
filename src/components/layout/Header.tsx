import { useState } from "react";
import { Search, Bell, Menu, User, Settings, LogOut } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";


interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const displayName = 
    user?.user_metadata?.full_name || 
    user?.user_metadata?.name || 
    user?.email?.split('@')[0] || 
    'Admin';

  const avatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D8ABC&color=fff`;

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center border-b border-gray-200 bg-white px-4 md:px-6">
      <div className="flex flex-1 items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="mr-2 rounded-lg p-1 text-text-muted hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="w-full max-w-sm">
           <div className="relative group">
             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted/40 group-focus-within:text-primary transition-colors" />
             <input 
               type="text"
               placeholder="Search entries..."
               className="h-10 w-full rounded-xl bg-gray-50/80 border border-gray-100 pl-10 pr-4 text-sm outline-none transition-all focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20"
             />
           </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-text-main hidden sm:inline-block">
          Welcome, {displayName}
        </span>
        <Button variant="primary" size="sm" className="hidden md:flex" onClick={() => navigate('/admin/menu/add')}>
          + Add New Dish
        </Button>
        <button className="relative rounded-full p-2 text-text-muted hover:bg-surface-muted hover:text-text-main">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        
        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex h-9 w-9 overflow-hidden rounded-full bg-gray-200 ring-2 ring-white transition-all hover:ring-primary/20 active:scale-95 shadow-sm"
          >
             <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
          </button>

          {isProfileOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/5 z-20 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-3 py-2 border-b border-gray-50 mb-1">
                  <p className="text-xs font-bold text-text-main truncate">{displayName}</p>
                  <p className="text-[10px] font-medium text-text-muted truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    navigate('/admin/settings');
                    setIsProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-text-muted hover:bg-primary/5 hover:text-primary transition-all"
                >
                  <User className="h-4 w-4" />
                  Ver perfil
                </button>
                <button
                  onClick={() => {
                    navigate('/admin/settings');
                    setIsProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-text-muted hover:bg-primary/5 hover:text-primary transition-all"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <div className="mt-1 pt-1 border-t border-gray-50">
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
