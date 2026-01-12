import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(email, password);
    
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  return (
    <Layout>
      <div className="container-shop py-16 lg:py-24">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Admin Login
            </h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-secondary/50 rounded-lg">
            <h3 className="font-medium text-foreground text-sm mb-2">Demo Credentials:</h3>
            <p className="text-xs text-muted-foreground">
              Email: admin@artisan.com<br />
              Password: admin123
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Note: In production, this uses the Express API with SQLite.
              For this demo, login is simulated on the frontend.
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to Store
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
