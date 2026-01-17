import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { User, Mail, Phone, Shield, Bell, Clock, Settings, Camera, Key, Activity } from 'lucide-react';

interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}

const mockActivityLogs: ActivityLog[] = [
  { id: '1', action: 'Login', timestamp: '2024-01-15 09:30 AM', details: 'Logged in from Chrome on Windows' },
  { id: '2', action: 'Product Created', timestamp: '2024-01-15 10:15 AM', details: 'Created product "Chocolate Cake"' },
  { id: '3', action: 'Settings Changed', timestamp: '2024-01-14 03:45 PM', details: 'Updated notification preferences' },
  { id: '4', action: 'Employee Added', timestamp: '2024-01-14 02:30 PM', details: 'Added new employee "Rahul Kumar"' },
  { id: '5', action: 'Report Generated', timestamp: '2024-01-13 11:00 AM', details: 'Generated sales report for January' },
];

export default function Profile() {
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@teabakery.com',
    phone: '+91 98765 43210',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false,
    weeklyReport: true,
    loginAlerts: true
  });

  const handleSaveProfile = () => {
    if (!profile.name || !profile.email) {
      toast.error('Name and email are required');
      return;
    }
    toast.success('Profile updated successfully');
  };

  const handleChangePassword = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.new.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    toast.success('Password changed successfully');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleSavePreferences = () => {
    toast.success('Preferences saved successfully');
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="w-4 h-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Activity className="w-4 h-4" /> Activity
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and profile photo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profile.avatar} />
                      <AvatarFallback className="text-2xl">{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <Button 
                      size="icon" 
                      className="absolute bottom-0 right-0 rounded-full w-8 h-8"
                      onClick={() => toast.info('Photo upload functionality coming soon')}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <h2 className="font-semibold text-xl">{profile.name}</h2>
                    <Badge variant="secondary" className="mt-1">{profile.role}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <User className="w-4 h-4" /> Full Name
                    </Label>
                    <Input 
                      value={profile.name} 
                      onChange={e => setProfile({...profile, name: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email Address
                    </Label>
                    <Input 
                      type="email"
                      value={profile.email} 
                      onChange={e => setProfile({...profile, email: e.target.value})}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Phone Number
                    </Label>
                    <Input 
                      value={profile.phone} 
                      onChange={e => setProfile({...profile, phone: e.target.value})}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Role
                    </Label>
                    <Input 
                      value={profile.role}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveProfile} className="w-full md:w-auto">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" /> Change Password
                </CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input 
                    type="password"
                    value={passwords.current}
                    onChange={e => setPasswords({...passwords, current: e.target.value})}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input 
                    type="password"
                    value={passwords.new}
                    onChange={e => setPasswords({...passwords, new: e.target.value})}
                    placeholder="Enter new password (min 8 characters)"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input 
                    type="password"
                    value={passwords.confirm}
                    onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                    placeholder="Confirm new password"
                  />
                </div>
                <Button onClick={handleChangePassword} className="w-full md:w-auto">
                  Change Password
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable 2FA</p>
                    <p className="text-sm text-muted-foreground">Secure your account with two-factor authentication</p>
                  </div>
                  <Switch 
                    onCheckedChange={() => toast.info('Two-factor authentication coming soon')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch 
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => setPreferences({...preferences, emailNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                  </div>
                  <Switch 
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) => setPreferences({...preferences, pushNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Alerts</p>
                    <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                  </div>
                  <Switch 
                    checked={preferences.smsAlerts}
                    onCheckedChange={(checked) => setPreferences({...preferences, smsAlerts: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Report</p>
                    <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                  </div>
                  <Switch 
                    checked={preferences.weeklyReport}
                    onCheckedChange={(checked) => setPreferences({...preferences, weeklyReport: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Login Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                  </div>
                  <Switch 
                    checked={preferences.loginAlerts}
                    onCheckedChange={(checked) => setPreferences({...preferences, loginAlerts: checked})}
                  />
                </div>
                <Button onClick={handleSavePreferences} className="w-full md:w-auto">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" /> Recent Activity
                </CardTitle>
                <CardDescription>Your recent account activity and actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActivityLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-4 bg-secondary/50 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Activity className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{log.action}</p>
                          <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
