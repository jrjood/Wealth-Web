import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Project {
  id: string;
  title: string;
  location: string;
  type: string;
  status: string;
  description: string;
  details?: string | null;
  imageUrl?: string | null;
  featured: boolean;
  amenities?: string | null;
  specifications?: string | null;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: 'Residential',
    status: 'Under Construction',
    description: '',
    details: '',
    imageUrl: '',
    amenities: '',
    specifications: '',
    featured: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchProjects();
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects`);
      const data = await response.json();
      const normalized = Array.isArray(data)
        ? data.map((project) => ({
            ...project,
            title: project.title ?? project.name ?? '',
            imageUrl: project.imageUrl ?? project.image ?? null,
          }))
        : [];
      setProjects(normalized);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch projects',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const url = editingProject
        ? `${API_URL}/api/projects/${editingProject.id}`
        : `${API_URL}/api/projects`;

      const payload = {
        title: formData.title.trim(),
        location: formData.location.trim(),
        type: formData.type,
        status: formData.status,
        description: formData.description.trim(),
        details: formData.details.trim() || null,
        imageUrl: formData.imageUrl.trim() || null,
        featured: formData.featured,
        amenities: formData.amenities.trim() || null,
        specifications: formData.specifications.trim() || null,
      };

      const response = await fetch(url, {
        method: editingProject ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Operation failed');
      }

      toast({
        title: 'Success',
        description: `Project ${editingProject ? 'updated' : 'created'} successfully`,
      });

      setDialogOpen(false);
      resetForm();
      fetchProjects();
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
    if (!confirm('Are you sure you want to delete this project?')) return;

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`${API_URL}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Delete failed');

      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });

      fetchProjects();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      location: project.location,
      type: project.type,
      status: project.status,
      description: project.description,
      details: project.details || '',
      imageUrl: project.imageUrl || '',
      amenities: project.amenities || '',
      specifications: project.specifications || '',
      featured: project.featured,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      type: 'Residential',
      status: 'Under Construction',
      description: '',
      details: '',
      imageUrl: '',
      amenities: '',
      specifications: '',
      featured: false,
    });
    setEditingProject(null);
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
              <h1 className='text-3xl font-bold'>Manage Projects</h1>
              <p className='text-muted-foreground'>
                Add, edit, or remove projects
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
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? 'Edit' : 'Add'} Project
                </DialogTitle>
                <DialogDescription>
                  {editingProject ? 'Update' : 'Create a new'} project entry
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <Label htmlFor='name'>Project Name</Label>
                  <Input
                    id='name'
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='location'>Location</Label>
                  <Input
                    id='location'
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                  />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='type'>Type</Label>
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
                        <SelectItem value='Residential'>Residential</SelectItem>
                        <SelectItem value='Commercial'>Commercial</SelectItem>
                        <SelectItem value='Luxury Residential'>
                          Luxury Residential
                        </SelectItem>
                        <SelectItem value='Mixed Use'>Mixed Use</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor='status'>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Under Construction'>
                          Under Construction
                        </SelectItem>
                        <SelectItem value='Completed'>Completed</SelectItem>
                        <SelectItem value='Selling Now'>Selling Now</SelectItem>
                        <SelectItem value='Coming Soon'>Coming Soon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor='image'>Image URL (optional)</Label>
                  <Input
                    id='image'
                    type='url'
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder='https://example.com/image.jpg'
                  />
                </div>
                <div>
                  <Label htmlFor='details'>Details (optional)</Label>
                  <Textarea
                    id='details'
                    value={formData.details}
                    onChange={(e) =>
                      setFormData({ ...formData, details: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='amenities'>Amenities (optional)</Label>
                    <Input
                      id='amenities'
                      value={formData.amenities}
                      onChange={(e) =>
                        setFormData({ ...formData, amenities: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='specifications'>
                      Specifications (optional)
                    </Label>
                    <Input
                      id='specifications'
                      value={formData.specifications}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: e.target.value,
                        })
                      }
                    />
                  </div>
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
                    id='featured'
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, featured: checked as boolean })
                    }
                  />
                  <Label htmlFor='featured' className='cursor-pointer'>
                    Featured Project
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
                    {editingProject ? 'Update' : 'Create'} Project
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
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <div className='flex justify-between items-start'>
                      <div>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription>
                          {project.location} • {project.type} • {project.status}
                          {project.featured && (
                            <span className='ml-2 text-yellow-600'>
                              ★ Featured
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <div className='flex gap-2'>
                        <Button
                          variant='outline'
                          size='icon'
                          onClick={() => handleEdit(project)}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='destructive'
                          size='icon'
                          onClick={() => handleDelete(project.id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-muted-foreground'>
                      {project.description}
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
