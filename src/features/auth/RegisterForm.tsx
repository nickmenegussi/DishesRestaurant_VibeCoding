import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API
    setTimeout(() => {
        setLoading(false);
        navigate('/auth/login');
    }, 1000);
  };

  return (
    <Card className="overflow-hidden p-8 shadow-2xl">
       <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-text-main">Admin Registration</h1>
        <p className="text-text-muted mt-2">Create an account to manage your restaurant's menu globally.</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <Input label="Full Name" placeholder="John Doe" required />
        <Input label="Business Email" type="email" placeholder="admin@restaurant.com" required />
        <Input label="Password" type="password" placeholder="••••••••" required />
        <Input label="Confirm Password" type="password" placeholder="••••••••" required />

        <div className="pt-2">
            <Button type="submit" fullWidth size="lg" disabled={loading}>
            Sign Up
            <span className="ml-2">→</span>
            </Button>
        </div>
      </form>

      <div className="mt-6 pt-4 text-center">
        <span className="text-sm text-text-muted">Already have an account? </span>
        <Link to="/auth/login" className="text-sm font-bold text-primary hover:underline">
          Back to Login
        </Link>
      </div>
    </Card>
  );
}
