import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, MapPin, Briefcase, DollarSign, Eye, Edit2, Trash2, Users, CheckCircle, Mail, Phone, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { JobVacancy, getStoredData, setStoredData, initializeMockData, mockJobVacancies, departments } from '@/lib/mockData';
import { toast } from 'sonner';
import Lottie from 'lottie-react';

const emptyAnimation = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  layers: [{
    ty: 4,
    nm: "circle",
    sr: 1,
    ks: {
      o: { a: 1, k: [{ t: 0, s: [100] }, { t: 30, s: [50] }, { t: 60, s: [100] }] },
      p: { a: 0, k: [100, 100] },
      s: { a: 1, k: [{ t: 0, s: [100, 100] }, { t: 30, s: [110, 110] }, { t: 60, s: [100, 100] }] }
    },
    shapes: [{
      ty: "el",
      p: { a: 0, k: [0, 0] },
      s: { a: 0, k: [60, 60] }
    }, {
      ty: "st",
      c: { a: 0, k: [0.5, 0.5, 0.5, 0.3] },
      w: { a: 0, k: 4 }
    }]
  }]
};

interface JobApplication {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  status: 'new' | 'mailed' | 'called' | 'confirmed' | 'rejected';
  viewed: boolean;
  appliedDate: string;
}

interface JobFormData {
  title: string;
  department: string;
  location: string;
  jobType: 'full-time' | 'part-time' | 'contract';
  salaryMin: number;
  salaryMax: number;
  experience: string;
  description: string;
  requirements: string;
  status: 'active' | 'inactive' | 'filled';
  deadline: string;
}

const initialFormData: JobFormData = {
  title: '',
  department: '',
  location: '',
  jobType: 'full-time',
  salaryMin: 0,
  salaryMax: 0,
  experience: '',
  description: '',
  requirements: '',
  status: 'active',
  deadline: ''
};

// Mock applications
const mockApplications: JobApplication[] = [
  { id: 'app-1', jobId: 'job-001', name: 'Rahul Kumar', email: 'rahul@email.com', phone: '+91 98765 12345', experience: '3 years', status: 'new', viewed: false, appliedDate: '2024-01-15' },
  { id: 'app-2', jobId: 'job-001', name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 98765 12346', experience: '5 years', status: 'mailed', viewed: true, appliedDate: '2024-01-14' },
  { id: 'app-3', jobId: 'job-002', name: 'Arun Prakash', email: 'arun@email.com', phone: '+91 98765 12347', experience: '2 years', status: 'called', viewed: true, appliedDate: '2024-01-13' },
  { id: 'app-4', jobId: 'job-001', name: 'Lakshmi N', email: 'lakshmi@email.com', phone: '+91 98765 12348', experience: '4 years', status: 'confirmed', viewed: true, appliedDate: '2024-01-12' },
];

export default function Careers() {
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isApplicationsOpen, setIsApplicationsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    initializeMockData();
    setJobs(getStoredData('bakery_jobs', mockJobVacancies));
    setApplications(getStoredData('bakery_applications', mockApplications));
  }, []);

  const handleOpenCreate = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (job: JobVacancy) => {
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      jobType: job.jobType,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      experience: job.experience,
      description: job.description,
      requirements: job.requirements.join('\n'),
      status: job.status,
      deadline: job.deadline
    });
    setSelectedJob(job);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleOpenView = (job: JobVacancy) => {
    setSelectedJob(job);
    setIsViewOpen(true);
  };

  const handleOpenApplications = (job: JobVacancy) => {
    setSelectedJob(job);
    setIsApplicationsOpen(true);
  };

  const handleOpenDelete = (job: JobVacancy) => {
    setSelectedJob(job);
    setIsDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.department || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isEditing && selectedJob) {
      const updated = jobs.map(j =>
        j.id === selectedJob.id
          ? {
              ...j,
              ...formData,
              requirements: formData.requirements.split('\n').filter(r => r.trim())
            }
          : j
      );
      setJobs(updated);
      setStoredData('bakery_jobs', updated);
      toast.success('Job vacancy updated successfully');
    } else {
      const newJob: JobVacancy = {
        id: `job-${Date.now()}`,
        ...formData,
        requirements: formData.requirements.split('\n').filter(r => r.trim()),
        applications: 0,
        postedDate: new Date().toISOString().split('T')[0]
      };
      const updated = [...jobs, newJob];
      setJobs(updated);
      setStoredData('bakery_jobs', updated);
      toast.success('Job vacancy posted successfully');
    }

    setIsFormOpen(false);
    setFormData(initialFormData);
  };

  const handleDelete = () => {
    if (!selectedJob) return;
    const updated = jobs.filter(j => j.id !== selectedJob.id);
    setJobs(updated);
    setStoredData('bakery_jobs', updated);
    setIsDeleteOpen(false);
    toast.success('Job vacancy deleted');
  };

  const handleUpdateApplicationStatus = (appId: string, newStatus: JobApplication['status']) => {
    const updated = applications.map(app =>
      app.id === appId ? { ...app, status: newStatus, viewed: true } : app
    );
    setApplications(updated);
    setStoredData('bakery_applications', updated);
    toast.success('Application status updated');
  };

  const markAsViewed = (appId: string) => {
    const updated = applications.map(app =>
      app.id === appId ? { ...app, viewed: true } : app
    );
    setApplications(updated);
    setStoredData('bakery_applications', updated);
  };

  const getJobApplications = (jobId: string) => {
    return applications.filter(app => app.jobId === jobId);
  };

  const getStatusBadge = (status: JobVacancy['status']) => {
    const styles = {
      active: 'bg-accent',
      inactive: 'bg-muted',
      filled: 'bg-info text-white'
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  const getAppStatusBadge = (status: JobApplication['status']) => {
    const styles = {
      new: 'bg-primary',
      mailed: 'bg-info text-white',
      called: 'bg-warning text-foreground',
      confirmed: 'bg-accent',
      rejected: 'bg-destructive'
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Job Vacancies</h1>
            <p className="text-muted-foreground">Manage job postings and applications</p>
          </div>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Post Job
          </Button>
        </div>

        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-card rounded-xl">
            <Lottie animationData={emptyAnimation} className="w-48 h-48" />
            <p className="text-muted-foreground mt-4">No job vacancies posted yet</p>
            <Button onClick={handleOpenCreate} className="mt-4">
              Post Your First Job
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-card rounded-xl p-5 shadow-card">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold">{job.title}</h3>
                  {getStatusBadge(job.status)}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{job.department}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />{job.location}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="w-4 h-4" />{job.jobType} • {job.experience}
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <DollarSign className="w-4 h-4" />₹{job.salaryMin.toLocaleString()} - ₹{job.salaryMax.toLocaleString()}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {getJobApplications(job.id).length} applications
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleOpenView(job)}>
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleOpenEdit(job)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleOpenDelete(job)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button size="sm" onClick={() => handleOpenApplications(job)} className="w-full">
                    View Applications
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Job Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Job Vacancy' : 'Post New Job'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Job Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Senior Chef"
                />
              </div>
              <div className="space-y-2">
                <Label>Department *</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location *</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Chennai"
                />
              </div>
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select
                  value={formData.jobType}
                  onValueChange={(value) => setFormData({ ...formData, jobType: value as JobFormData['jobType'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Min Salary</Label>
                <Input
                  type="number"
                  value={formData.salaryMin}
                  onChange={(e) => setFormData({ ...formData, salaryMin: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Max Salary</Label>
                <Input
                  type="number"
                  value={formData.salaryMax}
                  onChange={(e) => setFormData({ ...formData, salaryMax: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Experience</Label>
                <Input
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="e.g., 2-4 years"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Job description..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Requirements (one per line)</Label>
              <Textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="Enter requirements..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as JobFormData['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="filled">Filled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Application Deadline</Label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1" onClick={handleSubmit}>
                {isEditing ? 'Update Job' : 'Post Job'}
              </Button>
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Job Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedJob.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  {getStatusBadge(selectedJob.status)}
                  <Badge variant="outline">{selectedJob.jobType}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Department</p>
                    <p className="font-medium">{selectedJob.department}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{selectedJob.location}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Experience</p>
                    <p className="font-medium">{selectedJob.experience}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Salary Range</p>
                    <p className="font-medium">₹{selectedJob.salaryMin.toLocaleString()} - ₹{selectedJob.salaryMax.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Posted Date</p>
                    <p className="font-medium">{selectedJob.postedDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Deadline</p>
                    <p className="font-medium">{selectedJob.deadline}</p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Description</p>
                  <p>{selectedJob.description}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Requirements</p>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Applications Dialog */}
      <Dialog open={isApplicationsOpen} onOpenChange={setIsApplicationsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle>Applications for {selectedJob.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {getJobApplications(selectedJob.id).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No applications yet
                  </div>
                ) : (
                  getJobApplications(selectedJob.id).map(app => (
                    <div 
                      key={app.id} 
                      className={`p-4 rounded-lg border ${!app.viewed ? 'bg-primary/5 border-primary/20' : 'bg-card'}`}
                      onClick={() => markAsViewed(app.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{app.name}</h4>
                            {!app.viewed && <Badge className="bg-primary text-xs">New</Badge>}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {app.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {app.phone}
                            </span>
                          </div>
                          <p className="text-sm mt-1">Experience: {app.experience}</p>
                          <p className="text-xs text-muted-foreground mt-1">Applied: {app.appliedDate}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getAppStatusBadge(app.status)}
                          <Select
                            value={app.status}
                            onValueChange={(value) => handleUpdateApplicationStatus(app.id, value as JobApplication['status'])}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="mailed">Mailed</SelectItem>
                              <SelectItem value="called">Called</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Vacancy?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedJob?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
