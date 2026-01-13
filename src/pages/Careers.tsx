import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Briefcase, DollarSign } from 'lucide-react';
import { JobVacancy, mockJobVacancies, getStoredData, initializeMockData } from '@/lib/mockData';

export default function Careers() {
  const [jobs, setJobs] = useState<JobVacancy[]>([]);

  useEffect(() => {
    initializeMockData();
    setJobs(getStoredData('bakery_jobs', mockJobVacancies));
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">Job Vacancies</h1>
          <Button><Plus className="w-4 h-4 mr-2" />Post Job</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map(job => (
            <div key={job.id} className="bg-card rounded-xl p-5 shadow-card">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold">{job.title}</h3>
                <Badge className={job.status === 'active' ? 'bg-accent' : 'bg-muted'}>{job.status}</Badge>
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
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{job.applications} applications</span>
                <Button size="sm">View Applications</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
