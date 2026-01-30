import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
  id: 'user-001',
  email: 'admin@thathatea.com',
  name: 'Admin User',
  role: 'Super Admin',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem('bakery_auth');
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      setUser(authData.user);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    if (email === 'admin@thathatea.com' && password === 'admin123') {
      const authData = { user: MOCK_USER, token: 'mock-jwt-token' };
      localStorage.setItem('bakery_auth', JSON.stringify(authData));
      setUser(MOCK_USER);
      setIsAuthenticated(true);
      return true;
    }
    // Allow any login for demo purposes
    if (email && password.length >= 6) {
      const demoUser = { ...MOCK_USER, email, name: email.split('@')[0] };
      const authData = { user: demoUser, token: 'mock-jwt-token' };
      localStorage.setItem('bakery_auth', JSON.stringify(authData));
      setUser(demoUser);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('bakery_auth');
    setUser(null);
    setIsAuthenticated(false);
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    // Store email for OTP verification
    localStorage.setItem('bakery_reset_email', email);
    localStorage.setItem('bakery_otp', '123456'); // Mock OTP
    return true;
  };

  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    const storedOtp = localStorage.getItem('bakery_otp');
    return otp === storedOtp || otp === '123456';
  };

  const resetPassword = async (email: string, newPassword: string): Promise<boolean> => {
    // Mock password reset
    localStorage.removeItem('bakery_otp');
    localStorage.removeItem('bakery_reset_email');
    return newPassword.length >= 6;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, forgotPassword, verifyOtp, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
