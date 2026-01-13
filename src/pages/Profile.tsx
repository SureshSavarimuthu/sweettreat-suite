import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@teabakery.com',
    phone: '+91 98765 43210',
    role: 'Super Admin'
  });

  const handleSave = () => toast.success('Profile updated successfully');

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="font-display text-2xl font-bold">Profile Settings</h1>

        <div className="bg-card rounded-xl p-6 shadow-card space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200" />
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-lg">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.role}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">Save Changes</Button>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-card space-y-4">
          <h3 className="font-semibold">Change Password</h3>
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" />
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" />
          </div>
          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <Input type="password" />
          </div>
          <Button variant="outline" className="w-full" onClick={() => toast.success('Password changed')}>
            Change Password
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
