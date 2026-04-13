import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Download, RefreshCw, Users } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface JobApplication {
  id: string;
  jobTitle: string;
  jobDepartment?: string | null;
  jobLocation?: string | null;
  jobType?: string | null;
  name: string;
  email: string;
  phone: string;
  message?: string | null;
  cvOriginalName: string;
  status: string;
  createdAt: string;
  job?: {
    id: string;
    title: string;
  } | null;
}

const statusOptions = [
  { label: 'New', value: 'new' },
  { label: 'In Review', value: 'in_review' },
  { label: 'Shortlisted', value: 'shortlisted' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Hired', value: 'hired' },
];

export default function AdminApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchApplications();
  }, [navigate]);

  const fetchApplications = async () => {
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(
        `${API_URL}/api/job-applications/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch applications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('adminToken');
    setUpdatingId(id);

    try {
      const response = await fetch(`${API_URL}/api/job-applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || 'Failed to update status');
      }

      setApplications((current) =>
        current.map((application) =>
          application.id === id ? { ...application, status } : application,
        ),
      );

      toast({
        title: 'Success',
        description: 'Application status updated',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to update status',
        variant: 'destructive',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const downloadCv = async (id: string, fileName: string) => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      toast({
        title: 'Download failed',
        description: 'Admin token is missing. Please login again.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/job-applications/${id}/cv`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download CV');
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(objectUrl);
      }, 1500);
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message.includes('Failed to fetch')) {
        return;
      }

      toast({
        title: 'Download failed',
        description:
          error instanceof Error ? error.message : 'Unable to download CV',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout showFooter={false}>
      <div className='container mx-auto px-4 py-12'>
        <div className='mb-8 flex items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <Link to='/admin/dashboard'>
              <Button variant='ghost' size='icon'>
                <ArrowLeft className='h-4 w-4' />
              </Button>
            </Link>
            <div>
              <h1 className='text-3xl font-bold'>Job Applications</h1>
              <p className='text-muted-foreground'>
                Review applicants, update status, and download CVs
              </p>
            </div>
          </div>

          <Button variant='outline' onClick={fetchApplications}>
            <RefreshCw className='mr-2 h-4 w-4' />
            Refresh
          </Button>
        </div>

        <div className='mb-6 flex items-center gap-3 rounded-sm border border-border bg-card px-4 py-3'>
          <Users className='h-5 w-5 text-primary' />
          <p className='text-sm text-muted-foreground'>
            Total applications:{' '}
            <span className='font-semibold text-foreground'>
              {applications.length}
            </span>
          </p>
        </div>

        {loading ? (
          <div className='py-12 text-center'>Loading...</div>
        ) : applications.length === 0 ? (
          <div className='rounded-sm border border-border bg-card py-16 text-center'>
            <p className='text-muted-foreground'>No job applications yet.</p>
          </div>
        ) : (
          <div className='grid gap-4'>
            {applications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card>
                  <CardHeader>
                    <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                      <div className='space-y-1'>
                        <CardTitle>{application.name}</CardTitle>
                        <CardDescription>
                          {application.jobTitle}
                          {application.jobDepartment
                            ? ` • ${application.jobDepartment}`
                            : ''}
                          {application.jobLocation
                            ? ` • ${application.jobLocation}`
                            : ''}
                          {application.jobType
                            ? ` • ${application.jobType}`
                            : ''}
                        </CardDescription>
                        <p className='text-sm text-muted-foreground'>
                          {application.email} • {application.phone}
                        </p>
                      </div>

                      <div className='flex flex-wrap items-center gap-3'>
                        <div className='min-w-[180px]'>
                          <Label className='mb-2 block text-xs uppercase tracking-wide text-muted-foreground'>
                            Status
                          </Label>
                          <Select
                            value={application.status}
                            onValueChange={(value) =>
                              updateStatus(application.id, value)
                            }
                            disabled={updatingId === application.id}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((status) => (
                                <SelectItem
                                  key={status.value}
                                  value={status.value}
                                >
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          variant='outline'
                          onClick={() =>
                            downloadCv(
                              application.id,
                              application.cvOriginalName,
                            )
                          }
                        >
                          <Download className='mr-2 h-4 w-4' />
                          CV
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className='space-y-4'>
                    {application.message ? (
                      <div>
                        <p className='mb-2 text-sm font-medium text-foreground'>
                          Cover Letter
                        </p>
                        <p className='whitespace-pre-line text-sm text-muted-foreground'>
                          {application.message}
                        </p>
                      </div>
                    ) : null}

                    <div className='flex flex-wrap gap-4 text-xs text-muted-foreground'>
                      <span>CV: {application.cvOriginalName}</span>
                      <span>
                        Submitted:{' '}
                        {new Date(application.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
