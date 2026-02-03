import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useHubAuth } from '@/contexts/HubAuthContext';

interface HubProtectedRouteProps {
  children: ReactNode;
}

export function HubProtectedRoute({ children }: HubProtectedRouteProps) {
  const { hubUser, isLoading } = useHubAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!hubUser) {
    return <Navigate to="/hub/login" replace />;
  }

  return <>{children}</>;
}
