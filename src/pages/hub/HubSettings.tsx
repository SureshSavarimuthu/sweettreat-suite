import { useState } from 'react';
import {
  Settings,
  User,
  Bell,
  Moon,
  Sun,
  Factory,
  Warehouse,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { HubLayout } from '@/components/hub/HubLayout';
import { useHubAuth } from '@/contexts/HubAuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function HubSettings() {
  const { hub, hubUser } = useHubAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    lowStock: true,
    newOrders: true,
    production: true,
    staff: false,
  });

  if (!hub || !hubUser) return null;

  const HubIcon = hub.type === 'kitchen' ? Factory : Warehouse;

  const handleSaveNotifications = () => {
    toast({
      title: 'Settings Saved',
      description: 'Notification preferences have been updated.',
    });
  };

  return (
    <HubLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your hub preferences</p>
        </div>

        {/* Hub Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Hub Profile
            </CardTitle>
            <CardDescription>View your hub details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={cn(
                'p-4 rounded-xl',
                hub.type === 'kitchen' ? 'bg-primary/10' : 'bg-accent/10'
              )}>
                <HubIcon className={cn(
                  'w-8 h-8',
                  hub.type === 'kitchen' ? 'text-primary' : 'text-accent'
                )} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{hub.name}</h3>
                <p className="text-muted-foreground">{hub.code} • {hub.type}</p>
              </div>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{hub.address}, {hub.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Manager Phone</p>
                  <p className="font-medium">{hub.managerPhone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Your Profile
            </CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {hubUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{hubUser.name}</h3>
                <p className="text-muted-foreground capitalize">{hubUser.role}</p>
              </div>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{hubUser.email}</span>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Hub Type</Label>
                <div className="flex items-center gap-2 mt-1">
                  <HubIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="capitalize">{hubUser.hubType}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              Appearance
            </CardTitle>
            <CardDescription>Customize your display preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure alert preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when products are running low
                </p>
              </div>
              <Switch
                checked={notifications.lowStock}
                onCheckedChange={(checked) => setNotifications({ ...notifications, lowStock: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Orders</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when new orders arrive
                </p>
              </div>
              <Switch
                checked={notifications.newOrders}
                onCheckedChange={(checked) => setNotifications({ ...notifications, newOrders: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Production Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about production batch status
                </p>
              </div>
              <Switch
                checked={notifications.production}
                onCheckedChange={(checked) => setNotifications({ ...notifications, production: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Staff Attendance</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about staff check-ins
                </p>
              </div>
              <Switch
                checked={notifications.staff}
                onCheckedChange={(checked) => setNotifications({ ...notifications, staff: checked })}
              />
            </div>

            <Button onClick={handleSaveNotifications} className="w-full mt-4">
              Save Preferences
            </Button>
          </CardContent>
        </Card>
      </div>
    </HubLayout>
  );
}
