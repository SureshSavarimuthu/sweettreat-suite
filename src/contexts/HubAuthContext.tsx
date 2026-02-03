import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CentralHub, mockCentralHubs, getStoredData } from '@/lib/mockData';

export interface HubUser {
  id: string;
  email: string;
  name: string;
  hubId: string;
  hubName: string;
  hubType: 'kitchen' | 'warehouse';
  role: 'manager' | 'staff';
}

interface HubAuthContextType {
  hubUser: HubUser | null;
  hub: CentralHub | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const HubAuthContext = createContext<HubAuthContextType | undefined>(undefined);

// Mock hub users - each hub has its own credentials
export const mockHubUsers: { email: string; password: string; hubId: string; name: string; role: 'manager' | 'staff' }[] = [
  { email: 'annanagar@thathatea.com', password: 'hub123', hubId: 'hub-001', name: 'Rajesh Kumar', role: 'manager' },
  { email: 'central@thathatea.com', password: 'hub123', hubId: 'hub-002', name: 'Priya Sharma', role: 'manager' },
  { email: 'tnagar@thathatea.com', password: 'hub123', hubId: 'hub-003', name: 'Suresh Menon', role: 'manager' },
  { email: 'north@thathatea.com', password: 'hub123', hubId: 'hub-004', name: 'Lakshmi Devi', role: 'manager' },
  { email: 'velachery@thathatea.com', password: 'hub123', hubId: 'hub-005', name: 'Arun Prakash', role: 'manager' },
  { email: 'adyar@thathatea.com', password: 'hub123', hubId: 'hub-006', name: 'Meena Kumari', role: 'manager' },
];

export function HubAuthProvider({ children }: { children: ReactNode }) {
  const [hubUser, setHubUser] = useState<HubUser | null>(null);
  const [hub, setHub] = useState<CentralHub | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('hub_user');
    if (storedUser) {
      const user = JSON.parse(storedUser) as HubUser;
      setHubUser(user);
      
      const hubs = getStoredData<CentralHub[]>('bakery_central_hubs', mockCentralHubs);
      const userHub = hubs.find(h => h.id === user.hubId);
      if (userHub) {
        setHub(userHub);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const user = mockHubUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return { success: false, error: 'Invalid credentials. Please check your hub email and password.' };
    }

    const hubs = getStoredData<CentralHub[]>('bakery_central_hubs', mockCentralHubs);
    const userHub = hubs.find(h => h.id === user.hubId);

    if (!userHub) {
      return { success: false, error: 'Hub not found. Please contact admin.' };
    }

    const hubUserData: HubUser = {
      id: user.hubId,
      email: user.email,
      name: user.name,
      hubId: user.hubId,
      hubName: userHub.name,
      hubType: userHub.type,
      role: user.role,
    };

    setHubUser(hubUserData);
    setHub(userHub);
    localStorage.setItem('hub_user', JSON.stringify(hubUserData));

    return { success: true };
  };

  const logout = () => {
    setHubUser(null);
    setHub(null);
    localStorage.removeItem('hub_user');
  };

  return (
    <HubAuthContext.Provider value={{ hubUser, hub, isLoading, login, logout }}>
      {children}
    </HubAuthContext.Provider>
  );
}

export function useHubAuth() {
  const context = useContext(HubAuthContext);
  if (context === undefined) {
    throw new Error('useHubAuth must be used within a HubAuthProvider');
  }
  return context;
}
