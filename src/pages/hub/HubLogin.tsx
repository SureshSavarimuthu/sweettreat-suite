import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Factory, Warehouse, Eye, EyeOff, Loader2, Coffee } from 'lucide-react';
import { useHubAuth, mockHubUsers } from '@/contexts/HubAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function HubLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useHubAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast({
        title: 'Welcome!',
        description: 'Successfully logged into hub panel.',
      });
      navigate('/hub');
    } else {
      toast({
        title: 'Login Failed',
        description: result.error,
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Coffee className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Thatha Tea Hub
          </h1>
          <p className="text-muted-foreground mt-1">Kitchen & Warehouse Portal</p>
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Hub Login</CardTitle>
            <CardDescription>
              Enter your hub credentials to access the panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Hub Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hubname@thathatea.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 rounded-lg bg-secondary/50 border">
              <p className="text-sm font-medium text-foreground mb-3">Demo Hub Credentials:</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Factory className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Kitchen - Anna Nagar:</span>
                  <code className="bg-background px-1 rounded">annanagar@thathatea.com</code>
                </div>
                <div className="flex items-center gap-2">
                  <Warehouse className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground">Warehouse - Central:</span>
                  <code className="bg-background px-1 rounded">central@thathatea.com</code>
                </div>
                <div className="flex items-center gap-2">
                  <Factory className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Kitchen - T Nagar:</span>
                  <code className="bg-background px-1 rounded">tnagar@thathatea.com</code>
                </div>
                <p className="text-muted-foreground mt-2">
                  Password for all: <code className="bg-background px-1 rounded">hub123</code>
                </p>
              </div>
            </div>

            {/* Admin Link */}
            <div className="mt-4 text-center">
              <a
                href="/login"
                className="text-sm text-primary hover:underline"
              >
                Go to Admin Panel →
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
