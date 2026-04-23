import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { adminFetch } from '@/lib/adminApi';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  published: boolean;
}

export default function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    department: 'Development',
    location: '',
    type: 'Full-time',
    description: '',
    published: true,
  });

  useEffect(() => {
    void fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await adminFetch('/api/jobs/admin/all');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch jobs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingJob ? `/api/jobs/${editingJob.id}` : '/api/jobs';

      const response = await adminFetch(url, {
        method: editingJob ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Operation failed');
      }

      toast({
        title: 'Success',
        description: `Job ${editingJob ? 'updated' : 'created'} successfully`,
      });

      setDialogOpen(false);
      resetForm();
      fetchJobs();
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Operation failed',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const response = await adminFetch(`/api/jobs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

      toast({
        title: 'Success',
        description: 'Job deleted successfully',
      });

      fetchJobs();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete job',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      description: job.description,
      published: job.published,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      department: 'Development',
      location: '',
      type: 'Full-time',
      description: '',
      published: true,
    });
    setEditingJob(null);
  };

  return (
    <Layout showFooter={false}>
      <div className='container mx-auto px-4 py-12'>
        <div className='flex justify-between items-center mb-8'>
          <div className='flex items-center gap-4'>
            <Link to='/admin/dashboard'>
              <Button variant='ghost' size='icon'>
                <ArrowLeft className='h-4 w-4' />
              </Button>
            </Link>
            <div>
              <h1 className='text-3xl font-bold'>Manage Jobs</h1>
              <p className='text-muted-foreground'>
                Add, edit, or remove job openings
              </p>
            </div>
          </div>

          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                Add Job
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>{editingJob ? 'Edit' : 'Add'} Job</DialogTitle>
                <DialogDescription>
                  {editingJob ? 'Update' : 'Create a new'} job opening
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <Label htmlFor='title'>Job Title</Label>
                  <Input
                    id='title'
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='department'>Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) =>
                        setFormData({ ...formData, department: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Development'>Development</SelectItem>
                        <SelectItem value='Sales'>Sales</SelectItem>
                        <SelectItem value='Marketing'>Marketing</SelectItem>
                        <SelectItem value='Design'>Design</SelectItem>
                        <SelectItem value='Finance'>Finance</SelectItem>
                        <SelectItem value='Operations'>Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor='type'>Job Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Full-time'>Full-time</SelectItem>
                        <SelectItem value='Part-time'>Part-time</SelectItem>
                        <SelectItem value='Contract'>Contract</SelectItem>
                        <SelectItem value='Internship'>Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor='location'>Location</Label>
                  <Input
                    id='location'
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder='Dubai, UAE'
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='description'>Description</Label>
                  <Textarea
                    id='description'
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    required
                  />
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='published'
                    checked={formData.published}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        published: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor='published' className='cursor-pointer'>
                    Published (visible to public)
                  </Label>
                </div>
                <div className='flex justify-end gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type='submit'>
                    {editingJob ? 'Update' : 'Create'} Job
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className='text-center py-12'>Loading...</div>
        ) : (
          <div className='grid gap-4'>
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <div className='flex justify-between items-start'>
                      <div>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription>
                          {job.department} • {job.location} • {job.type}
                          {!job.published && (
                            <span className='ml-2 text-red-600'>
                              • Unpublished
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <div className='flex gap-2'>
                        <Button
                          variant='outline'
                          size='icon'
                          onClick={() => handleEdit(job)}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='destructive'
                          size='icon'
                          onClick={() => handleDelete(job.id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-muted-foreground'>
                      {job.description}
                    </p>
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
