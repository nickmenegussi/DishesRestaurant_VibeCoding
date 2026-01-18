import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Checkbox } from "../../components/ui/Checkbox";

import { useToast } from "../../components/ui/Toast";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      addToast("Welcome back!", 'success');
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error("Login component error:", error);
      addToast(error.message || "Failed to sign in. Check your credentials.", 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
             <span className="text-xl font-bold">*</span>
          </div>
          <span className="text-xl font-bold text-text-main tracking-tight">Global Bites</span>
        </div>
        
        <h1 className="text-3xl font-extrabold text-text-main tracking-tight mb-2">Welcome Back</h1>
        <p className="text-text-muted">Enter your credentials to access the admin dashboard.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <Input 
          label="Email Address" 
          type="email" 
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
          className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all"
        />
        
        <div className="relative">
          <Input 
             label="Password" 
             type={showPassword ? "text" : "password"} 
             placeholder="••••••••"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required
             className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-text-muted hover:text-text-main p-1"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between py-1">
           <Checkbox label="Remember me" />
           <Link to="#" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">Forgot password?</Link>
        </div>

        <Button type="submit" fullWidth size="lg" disabled={isLoading || isSubmitting} className="h-12 text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all">
          {(isLoading || isSubmitting) ? "Signing In..." : "Sign In to Dashboard"}
          {!(isLoading || isSubmitting) && <LogIn className="ml-2 h-4 w-4" />}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-text-muted">
          Don't have an account?{" "}
          <Link to="/auth/register" className="font-bold text-primary hover:text-primary/80 hover:underline transition-colors">
            Create an account
          </Link>
        </p>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-text-muted/60 font-medium uppercase tracking-wider">
        <span>Secure System</span>
        <span>•</span>
        <span className="hover:text-text-muted cursor-pointer transition-colors">Help & Support</span>
      </div>
    </div>
  );
}
