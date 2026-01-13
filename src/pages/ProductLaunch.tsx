import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Rocket } from 'lucide-react';
import { ProductLaunch as LaunchType, mockProductLaunches, getStoredData, initializeMockData } from '@/lib/mockData';

export default function ProductLaunch() {
  const [launches, setLaunches] = useState<LaunchType[]>([]);

  useEffect(() => {
    initializeMockData();
    setLaunches(getStoredData('bakery_launches', mockProductLaunches));
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">Product Launches</h1>
          <Button><Plus className="w-4 h-4 mr-2" />New Launch</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {launches.map(launch => (
            <div key={launch.id} className="bg-card rounded-xl overflow-hidden shadow-card">
              <img src={launch.bannerImage} alt={launch.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{launch.title}</h3>
                  <Badge className={launch.status === 'active' ? 'bg-accent' : 'bg-muted'}>{launch.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{launch.description}</p>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Views: {launch.views}</span>
                  <span>Clicks: {launch.clicks}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
