import { useState, useEffect, useRef } from "react";
import { User, Shield, Bell, Save, RefreshCw, Camera, Globe } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../context/AuthContext";
// import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../components/ui/Toast";
import { cn } from "../../utils/cn";
import { authService, storageService } from "../../../backend";

const LANGUAGES = [
  { code: 'en', name: 'English (US)' },
  { code: 'pt', name: 'Português (BR)' },
  { code: 'es', name: 'Español' },
];

export default function SettingsPage() {
  const { user } = useAuth();
  // const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [profile, setProfile] = useState({
    fullName: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    avatar: user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    bio: user?.user_metadata?.bio || ""
  });

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.user_metadata?.full_name || "",
        email: user.email || "",
        avatar: user.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
        bio: user.user_metadata?.bio || ""
      });
      setImagePreview(user.user_metadata?.avatar_url || "");
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [preferences, setPreferences] = useState({
    notifications: true,
    darkMode: false,
    language: 'en'
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
        const updates: any = {};
        
        // Profile updates
        if (activeTab === 'profile') {
            let avatarUrl = profile.avatar;

            // 1. Upload new image if exists
            if (imageFile && user?.id) {
                try {
                    addToast("Uploading profile picture...", "info");
                    const res = await storageService.uploadProfileImage(imageFile, user.id);
                    avatarUrl = res?.url || avatarUrl;
                } catch (err: any) {
                    console.error("Photo upload failed:", err);
                    addToast("Failed to upload photo", "error");
                    setIsSaving(false);
                    return;
                }
            }

            // 2. Prepare metadata updates
            const metadataChange = 
                profile.fullName !== user?.user_metadata?.full_name || 
                avatarUrl !== user?.user_metadata?.avatar_url ||
                profile.bio !== user?.user_metadata?.bio;

            if (metadataChange) {
                updates.data = { 
                    full_name: profile.fullName,
                    avatar_url: avatarUrl,
                    bio: profile.bio
                };
            }
        }
        
        // Security updates (password)
        if (activeTab === 'security') {
           if (security.newPassword) {
               if (security.newPassword !== security.confirmPassword) {
                   addToast("Passwords do not match", "error");
                   setIsSaving(false);
                   return;
               }
               updates.password = security.newPassword;
           }
        }

        if (Object.keys(updates).length > 0) {
            await authService.updateUser(updates);
            addToast("Settings updated successfully!", "success");
            
            // Reset image file after successful upload
            setImageFile(null);

            // Clear password fields on success
            if (updates.password) {
                setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
            }
        } else {
            addToast("No changes to save", "info");
        }

    } catch (error: any) {
        console.error("Update failed:", error);
        addToast(error.message || "Failed to update settings", "error");
    } finally {
        setIsSaving(false);
    }
  };

  const handleReset = () => {
    // Reset to initial values (simplified for this demo)
    setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
    addToast("Changes discarded", "info");
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-text-main">Settings</h1>
        <p className="text-text-muted mt-2">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="lg:w-64 flex-shrink-0">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
            <button
              onClick={() => setActiveTab('profile')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap",
                activeTab === 'profile' 
                  ? "bg-primary text-white shadow-md" 
                  : "text-text-muted hover:bg-white hover:text-text-main"
              )}
            >
              <User className="h-5 w-5" />
              My Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap",
                activeTab === 'security' 
                  ? "bg-primary text-white shadow-md" 
                  : "text-text-muted hover:bg-white hover:text-text-main"
              )}
            >
              <Shield className="h-5 w-5" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap",
                activeTab === 'preferences' 
                  ? "bg-primary text-white shadow-md" 
                  : "text-text-muted hover:bg-white hover:text-text-main"
              )}
            >
              <Bell className="h-5 w-5" />
              Preferences
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-gray-100">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <img 
                      src={imagePreview || profile.avatar} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full object-cover ring-4 ring-primary-light group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-bold text-text-main">Profile Photo</h3>
                    <p className="text-sm text-text-muted mb-3">Accepts JPG, PNG or GIF. Max size of 8MB</p>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                        Change Photo
                      </Button>
                      {imageFile && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(user?.user_metadata?.avatar_url || "");
                          }}
                        >
                          Undo
                        </Button>
                      )}
                    </div>
                    <input 
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Input 
                        label="Full Name"
                        value={profile.fullName}
                        onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                        placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input 
                        label="Email Address"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        placeholder="e.g. john@example.com"
                        disabled // Typically email changes require verification
                    />
                    <p className="text-xs text-text-muted flex items-center gap-1 mt-1">
                        <Shield className="h-3 w-3" /> Email is linked to your authentication provider
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                    <label className="text-sm font-semibold text-text-main block mb-2">Bio</label>
                    <textarea 
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-text-main placeholder:text-text-muted transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent min-h-[120px] resize-none"
                        placeholder="Tell us a little bit about yourself..."
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    />
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800 mb-6">
                    <Shield className="h-5 w-5 flex-shrink-0" />
                    <div className="text-sm">
                        <p className="font-bold mb-1">Secure Your Account</p>
                        <p>Use a strong password and enable 2FA to protect your account. We recommend changing your password every 3 months.</p>
                    </div>
                </div>

                <div className="space-y-4 max-w-md">
                     <Input 
                        label="Current Password"
                        type="password"
                        value={security.currentPassword}
                        onChange={(e) => setSecurity({...security, currentPassword: e.target.value})}
                    />
                     <Input 
                        label="New Password"
                        type="password"
                        value={security.newPassword}
                        onChange={(e) => setSecurity({...security, newPassword: e.target.value})}
                    />
                     <Input 
                        label="Confirm New Password"
                        type="password"
                        value={security.confirmPassword}
                        onChange={(e) => setSecurity({...security, confirmPassword: e.target.value})}
                        error={security.newPassword !== security.confirmPassword && security.confirmPassword ? "Passwords do not match" : undefined}
                    />
                </div>
              </div>
            )}

            {/* PREFERENCES TAB */}
            {activeTab === 'preferences' && (
              <div className="space-y-8 animate-fadeIn">
                 {/* Notifications */}
                 <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                    <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-surface-muted flex items-center justify-center text-text-main">
                            <Bell className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-text-main">Email Notifications</h3>
                            <p className="text-sm text-text-muted">Receive emails about new orders and updates.</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={preferences.notifications}
                            onChange={(e) => setPreferences({...preferences, notifications: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                 </div>


                 {/* Language */}
                 <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-surface-muted flex items-center justify-center text-text-main">
                            <Globe className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-text-main">Language</h3>
                            <p className="text-sm text-text-muted">Select your preferred system language.</p>
                        </div>
                    </div>
                    <select 
                        className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                        value={preferences.language}
                        onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                    >
                         {LANGUAGES.map(lang => (
                             <option key={lang.code} value={lang.code}>{lang.name}</option>
                         ))}
                    </select>
                 </div>

              </div>
            )}

            {/* Actions */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
                <Button variant="ghost" onClick={handleReset} disabled={isSaving}>Discard Changes</Button>
                <Button onClick={handleSave} disabled={isSaving} className="min-w-[120px]">
                    {isSaving ? (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
