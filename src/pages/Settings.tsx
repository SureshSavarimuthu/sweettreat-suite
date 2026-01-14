import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Bell, Shield, Database, Palette, Globe, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    lowStock: true,
    newOrders: true,
    franchiseRequests: true,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="font-display text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your preferences and configurations</p>
        </div>

        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="bg-muted p-1">
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="system" className="gap-2">
              <Database className="w-4 h-4" />
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Theme Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
                    </div>
                  </div>
                  <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Display Settings</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                      <option value="en">English</option>
                      <option value="ta">Tamil</option>
                      <option value="hi">Hindi</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                      <option value="IST">India Standard Time (IST)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Notification Channels</h3>
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                  { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                  { key: 'sms', label: 'SMS Notifications', desc: 'Receive important alerts via SMS' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Alert Types</h3>
              <div className="space-y-4">
                {[
                  { key: 'lowStock', label: 'Low Stock Alerts', desc: 'When products are running low' },
                  { key: 'newOrders', label: 'New Order Alerts', desc: 'When new orders are placed' },
                  { key: 'franchiseRequests', label: 'Franchise Requests', desc: 'New franchise applications' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Password & Authentication</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium mb-2">Change Password</p>
                  <p className="text-sm text-muted-foreground mb-4">Update your account password</p>
                  <Button variant="outline">Change Password</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Session Management</h3>
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium mb-2">Active Sessions</p>
                <p className="text-sm text-muted-foreground mb-4">Manage your active login sessions</p>
                <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                  Logout All Devices
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Business Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input defaultValue="Tea & Bakery" />
                  </div>
                  <div className="space-y-2">
                    <Label>Business Email</Label>
                    <Input defaultValue="info@teabakery.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input defaultValue="+91 98765 43210" />
                  </div>
                  <div className="space-y-2">
                    <Label>GST Number</Label>
                    <Input defaultValue="33XXXXX1234X1Z" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Data Management</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium mb-2">Export Data</p>
                  <p className="text-sm text-muted-foreground mb-4">Download all your business data</p>
                  <Button variant="outline">Export All Data</Button>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium mb-2">Clear Cache</p>
                  <p className="text-sm text-muted-foreground mb-4">Clear local storage and cached data</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      localStorage.clear();
                      toast.success('Cache cleared successfully!');
                      window.location.reload();
                    }}
                  >
                    Clear Cache
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
