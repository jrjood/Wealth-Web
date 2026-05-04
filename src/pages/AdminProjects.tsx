import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';
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

interface GalleryImage {
  id: string;
  imageUrl: string;
  title?: string | null;
  sortOrder?: number;
}

interface NearbyLocation {
  id: string;
  name: string;
  distance: string;
  sortOrder?: number;
}

interface PaymentPlan {
  id: string;
  downPayment: string;
  installments: string;
  startingPrice: string;
}

interface Project {
  id: string;
  title: string;
  location: string;
  type: string;
  status: string;
  description: string;
  details?: string | null;
  imageUrl?: string | null;
  projectLogoUrl?: string | null;
  masterPlanImage?: string | null;
  locationImage?: string | null;
  locationMapUrl?: string | null;
  videoUrl?: string | null;
  brochureUrl?: string | null;
  featured: boolean;
  amenities?: string | null;
  specifications?: string | null;
  galleryImages?: GalleryImage[];
  nearbyLocations?: NearbyLocation[];
  paymentPlan?: PaymentPlan | null;
}

interface ProjectFormState {
  title: string;
  location: string;
  type: string;
  status: string;
  description: string;
  details: string;
  imageUrl: string;
  projectLogoUrl: string;
  masterPlanImage: string;
  locationImage: string;
  locationMapUrl: string;
  videoUrl: string;
  brochureUrl: string;
  amenities: string;
  specifications: string;
  featured: boolean;
  galleryImages: GalleryImage[];
  nearbyLocations: NearbyLocation[];
  paymentPlan: PaymentPlan;
}

const createGalleryRow = (): GalleryImage => ({
  id: `gal_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  imageUrl: '',
  title: '',
});

const createLocationRow = (): NearbyLocation => ({
  id: `loc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  name: '',
  distance: '',
});

const createPaymentPlan = (): PaymentPlan => ({
  id: `pay_${Date.now()}`,
  downPayment: '',
  installments: '',
  startingPrice: '',
});

const createInitialFormData = (): ProjectFormState => ({
  title: '',
  location: '',
  type: 'Residential',
  status: 'Under Construction',
  description: '',
  details: '',
  imageUrl: '',
  projectLogoUrl: '',
  masterPlanImage: '',
  locationImage: '',
  locationMapUrl: '',
  videoUrl: '',
  brochureUrl: '',
  amenities: '',
  specifications: '',
  featured: false,
  galleryImages: [createGalleryRow()],
  nearbyLocations: [createLocationRow()],
  paymentPlan: createPaymentPlan(),
});

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [projectLogoFile, setProjectLogoFile] = useState<File | null>(null);
  const [projectVideoFile, setProjectVideoFile] = useState<File | null>(null);
  const [masterPlanImageFile, setMasterPlanImageFile] = useState<File | null>(
    null,
  );
  const [locationImageFile, setLocationImageFile] = useState<File | null>(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<ProjectFormState>(
    createInitialFormData(),
  );
  const { toast } = useToast();

  useEffect(() => {
    void fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await adminFetch('/api/projects');
      const data = await response.json();
      const normalized = Array.isArray(data)
        ? data.map((project) => ({
            ...project,
            title: project.title ?? '',
            imageUrl: project.imageUrl ?? null,
          }))
        : [];
      setProjects(normalized);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to fetch projects',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setHeroImageFile(null);
    setProjectLogoFile(null);
    setProjectVideoFile(null);
    setMasterPlanImageFile(null);
    setLocationImageFile(null);
    setGalleryImageFiles([]);
    setEditingProject(null);
    setFormData(createInitialFormData());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingProject
        ? `/api/projects/${editingProject.id}`
        : '/api/projects';

      const payload = new FormData();
      payload.append('title', formData.title.trim());
      payload.append('location', formData.location.trim());
      payload.append('type', formData.type);
      payload.append('status', formData.status);
      payload.append('description', formData.description.trim());
      payload.append('details', formData.details.trim());
      payload.append('imageUrl', formData.imageUrl.trim());
      payload.append('existingImageUrl', formData.imageUrl.trim());
      payload.append('projectLogoUrl', formData.projectLogoUrl.trim());
      payload.append('existingProjectLogoUrl', formData.projectLogoUrl.trim());
      payload.append('masterPlanImage', formData.masterPlanImage.trim());
      payload.append(
        'existingMasterPlanImage',
        formData.masterPlanImage.trim(),
      );
      payload.append('locationImage', formData.locationImage.trim());
      payload.append('existingLocationImage', formData.locationImage.trim());
      payload.append('locationMapUrl', formData.locationMapUrl.trim());
      payload.append('videoUrl', formData.videoUrl.trim());
      payload.append('brochureUrl', formData.brochureUrl.trim());
      payload.append('featured', String(formData.featured));
      payload.append('amenities', formData.amenities.trim());
      payload.append('specifications', formData.specifications.trim());
      payload.append(
        'galleryImages',
        JSON.stringify(
          formData.galleryImages
            .filter((item) => item.imageUrl.trim())
            .map((item, index) => ({
              ...item,
              imageUrl: item.imageUrl.trim(),
              title: item.title?.trim() || null,
              sortOrder: index,
            })),
        ),
      );
      payload.append(
        'nearbyLocations',
        JSON.stringify(
          formData.nearbyLocations
            .filter((item) => item.name.trim() && item.distance.trim())
            .map((item, index) => ({
              ...item,
              name: item.name.trim(),
              distance: item.distance.trim(),
              sortOrder: index,
            })),
        ),
      );
      payload.append(
        'paymentPlan',
        JSON.stringify({
          ...formData.paymentPlan,
          downPayment: formData.paymentPlan.downPayment.trim(),
          installments: formData.paymentPlan.installments.trim(),
          startingPrice: formData.paymentPlan.startingPrice.trim(),
        }),
      );

      if (heroImageFile) {
        payload.append('image', heroImageFile);
      }

      if (projectLogoFile) {
        payload.append('projectLogoFile', projectLogoFile);
      }

      if (projectVideoFile) {
        payload.append('projectVideoFile', projectVideoFile);
      }

      if (masterPlanImageFile) {
        payload.append('masterPlanImageFile', masterPlanImageFile);
      }

      if (locationImageFile) {
        payload.append('locationImageFile', locationImageFile);
      }

      galleryImageFiles.forEach((file) => {
        payload.append('galleryImagesFiles', file);
      });

      const response = await adminFetch(url, {
        method: editingProject ? 'PUT' : 'POST',
        body: payload,
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
      await fetchProjects();
    } catch (submitError) {
      toast({
        title: 'Error',
        description:
          submitError instanceof Error
            ? submitError.message
            : 'Operation failed',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await adminFetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });

      await fetchProjects();
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = async (project: Project) => {
    try {
      const response = await adminFetch(`/api/projects/${project.id}`);

      if (!response.ok) {
        throw new Error('Failed to load project details');
      }

      const detailedProject = await response.json();
      setEditingProject(detailedProject);
      setHeroImageFile(null);
      setProjectLogoFile(null);
      setProjectVideoFile(null);
      setMasterPlanImageFile(null);
      setLocationImageFile(null);
      setGalleryImageFiles([]);
      setFormData({
        title: detailedProject.title ?? '',
        location: detailedProject.location ?? '',
        type: detailedProject.type ?? 'Residential',
        status: detailedProject.status ?? 'Under Construction',
        description: detailedProject.description ?? '',
        details: detailedProject.details || '',
        imageUrl: detailedProject.imageUrl || '',
        projectLogoUrl: detailedProject.projectLogoUrl || '',
        masterPlanImage: detailedProject.masterPlanImage || '',
        locationImage: detailedProject.locationImage || '',
        locationMapUrl: detailedProject.locationMapUrl || '',
        videoUrl: detailedProject.videoUrl || '',
        brochureUrl: detailedProject.brochureUrl || '',
        amenities: detailedProject.amenities || '',
        specifications: detailedProject.specifications || '',
        featured: Boolean(detailedProject.featured),
        galleryImages:
          detailedProject.galleryImages?.length > 0
            ? detailedProject.galleryImages
            : [createGalleryRow()],
        nearbyLocations:
          detailedProject.nearbyLocations?.length > 0
            ? detailedProject.nearbyLocations
            : [createLocationRow()],
        paymentPlan: detailedProject.paymentPlan || createPaymentPlan(),
      });
      setDialogOpen(true);
    } catch (loadError) {
      toast({
        title: 'Error',
        description:
          loadError instanceof Error
            ? loadError.message
            : 'Failed to load project details',
        variant: 'destructive',
      });
    }
  };

  const updateGalleryImage = (
    id: string,
    key: keyof GalleryImage,
    value: string | number,
  ) => {
    setFormData((current) => ({
      ...current,
      galleryImages: current.galleryImages.map((item) =>
        item.id === id ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const updateNearbyLocation = (
    id: string,
    key: keyof NearbyLocation,
    value: string | number,
  ) => {
    setFormData((current) => ({
      ...current,
      nearbyLocations: current.nearbyLocations.map((item) =>
        item.id === id ? { ...item, [key]: value } : item,
      ),
    }));
  };

  return (
    <Layout showFooter={false}>
      <div className='container mx-auto px-4 py-12'>
        <div className='mb-8 flex items-center justify-between'>
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
            <DialogContent className='max-h-[92vh] max-w-4xl overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? 'Edit' : 'Add'} Project
                </DialogTitle>
                <DialogDescription>
                  {editingProject ? 'Update' : 'Create a new'} project entry
                  with full detail-page content.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid gap-4 md:grid-cols-2'>
                  <div>
                    <Label htmlFor='title'>Project Name</Label>
                    <Input
                      id='title'
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
                </div>

                <div className='grid gap-4 md:grid-cols-2'>
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
                        <SelectItem value='Selling Now'>Launching</SelectItem>
                        <SelectItem value='Coming Soon'>Coming Soon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='space-y-4 rounded-xl border border-border p-4'>
                  <h3 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
                    Core Media
                  </h3>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div>
                      <Label htmlFor='imageUrl'>Hero image URL</Label>
                      <Input
                        id='imageUrl'
                        value={formData.imageUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, imageUrl: e.target.value })
                        }
                        placeholder='https://...'
                      />
                    </div>
                    <div>
                      <Label htmlFor='imageFile'>Hero image upload</Label>
                      <Input
                        id='imageFile'
                        type='file'
                        accept='image/*'
                        onChange={(e) =>
                          setHeroImageFile(e.target.files?.[0] || null)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor='projectLogoUrl'>Project logo URL</Label>
                      <Input
                        id='projectLogoUrl'
                        value={formData.projectLogoUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            projectLogoUrl: e.target.value,
                          })
                        }
                        placeholder='https://...'
                      />
                    </div>
                    <div>
                      <Label htmlFor='projectLogoFile'>
                        Project logo upload
                      </Label>
                      <Input
                        id='projectLogoFile'
                        type='file'
                        accept='image/*'
                        onChange={(e) =>
                          setProjectLogoFile(e.target.files?.[0] || null)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor='masterPlanImage'>
                        Master plan image URL
                      </Label>
                      <Input
                        id='masterPlanImage'
                        value={formData.masterPlanImage}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            masterPlanImage: e.target.value,
                          })
                        }
                        placeholder='https://...'
                      />
                    </div>
                    <div>
                      <Label htmlFor='masterPlanImageFile'>
                        Master plan upload
                      </Label>
                      <Input
                        id='masterPlanImageFile'
                        type='file'
                        accept='image/*'
                        onChange={(e) =>
                          setMasterPlanImageFile(e.target.files?.[0] || null)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor='locationImage'>Location image URL</Label>
                      <Input
                        id='locationImage'
                        value={formData.locationImage}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            locationImage: e.target.value,
                          })
                        }
                        placeholder='https://...'
                      />
                    </div>
                    <div>
                      <Label htmlFor='locationImageFile'>Location upload</Label>
                      <Input
                        id='locationImageFile'
                        type='file'
                        accept='image/*'
                        onChange={(e) =>
                          setLocationImageFile(e.target.files?.[0] || null)
                        }
                      />
                    </div>
                    <div className='md:col-span-2'>
                      <Label htmlFor='locationMapUrl'>
                        Google Maps directions URL
                      </Label>
                      <Input
                        id='locationMapUrl'
                        value={formData.locationMapUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            locationMapUrl: e.target.value,
                          })
                        }
                        placeholder='https://www.google.com/maps/...'
                      />
                    </div>
                    <div className='md:col-span-2'>
                      <Label htmlFor='videoUrl'>Video URL</Label>
                      <Input
                        id='videoUrl'
                        value={formData.videoUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, videoUrl: e.target.value })
                        }
                        placeholder='YouTube or direct MP4 URL'
                      />
                    </div>
                    <div className='md:col-span-2'>
                      <Label htmlFor='projectVideoFile'>
                        Hero video upload
                      </Label>
                      <Input
                        id='projectVideoFile'
                        type='file'
                        accept='video/mp4,video/webm,video/ogg,video/quicktime'
                        onChange={(e) =>
                          setProjectVideoFile(e.target.files?.[0] || null)
                        }
                      />
                      {projectVideoFile ? (
                        <p className='mt-2 text-xs text-muted-foreground'>
                          {projectVideoFile.name} selected.
                        </p>
                      ) : null}
                    </div>
                    <div className='md:col-span-2'>
                      <Label htmlFor='brochureUrl'>Brochure URL</Label>
                      <Input
                        id='brochureUrl'
                        value={formData.brochureUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            brochureUrl: e.target.value,
                          })
                        }
                        placeholder='PDF or brochure link'
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor='description'>Description</Label>
                  <Textarea
                    id='description'
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor='details'>Details</Label>
                  <Textarea
                    id='details'
                    value={formData.details}
                    onChange={(e) =>
                      setFormData({ ...formData, details: e.target.value })
                    }
                    rows={4}
                  />
                </div>

                <div className='grid gap-4 md:grid-cols-2'>
                  <div>
                    <Label htmlFor='amenities'>Amenities</Label>
                    <Textarea
                      id='amenities'
                      value={formData.amenities}
                      onChange={(e) =>
                        setFormData({ ...formData, amenities: e.target.value })
                      }
                      rows={4}
                      placeholder='One item per line'
                    />
                  </div>
                  <div>
                    <Label htmlFor='specifications'>Specifications</Label>
                    <Textarea
                      id='specifications'
                      value={formData.specifications}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: e.target.value,
                        })
                      }
                      rows={4}
                      placeholder='One item per line'
                    />
                  </div>
                </div>

                <div className='space-y-4 rounded-xl border border-border p-4'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
                      Gallery
                    </h3>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        setFormData((current) => ({
                          ...current,
                          galleryImages: [
                            ...current.galleryImages,
                            createGalleryRow(),
                          ],
                        }))
                      }
                    >
                      <Plus className='mr-2 h-4 w-4' />
                      Add URL
                    </Button>
                  </div>
                  <div className='space-y-3'>
                    {formData.galleryImages.map((image, index) => (
                      <div
                        key={image.id}
                        className='grid gap-3 rounded-lg border border-border p-3 md:grid-cols-[1fr_1fr_auto]'
                      >
                        <div>
                          <Label htmlFor={`gallery-title-${image.id}`}>
                            Photo name {index + 1}
                          </Label>
                          <Input
                            id={`gallery-title-${image.id}`}
                            value={image.title || ''}
                            onChange={(e) =>
                              updateGalleryImage(
                                image.id,
                                'title',
                                e.target.value,
                              )
                            }
                            placeholder='Lobby view'
                          />
                        </div>
                        <div>
                          <Label htmlFor={`gallery-${image.id}`}>
                            Gallery image URL {index + 1}
                          </Label>
                          <Input
                            id={`gallery-${image.id}`}
                            value={image.imageUrl}
                            onChange={(e) =>
                              updateGalleryImage(
                                image.id,
                                'imageUrl',
                                e.target.value,
                              )
                            }
                            placeholder='https://...'
                          />
                        </div>
                        <div className='flex items-end'>
                          <Button
                            type='button'
                            variant='destructive'
                            size='sm'
                            onClick={() =>
                              setFormData((current) => ({
                                ...current,
                                galleryImages:
                                  current.galleryImages.length > 1
                                    ? current.galleryImages.filter(
                                        (item) => item.id !== image.id,
                                      )
                                    : [createGalleryRow()],
                              }))
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div>
                      <Label htmlFor='galleryFiles'>Gallery uploads</Label>
                      <Input
                        id='galleryFiles'
                        type='file'
                        accept='image/*'
                        multiple
                        onChange={(e) =>
                          setGalleryImageFiles(Array.from(e.target.files || []))
                        }
                      />
                      {galleryImageFiles.length > 0 ? (
                        <p className='mt-2 text-xs text-muted-foreground'>
                          {galleryImageFiles.length} gallery image(s) selected.
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className='space-y-4 rounded-xl border border-border p-4'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
                      Nearby Locations
                    </h3>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        setFormData((current) => ({
                          ...current,
                          nearbyLocations: [
                            ...current.nearbyLocations,
                            createLocationRow(),
                          ],
                        }))
                      }
                    >
                      <Plus className='mr-2 h-4 w-4' />
                      Add Location
                    </Button>
                  </div>
                  <div className='space-y-3'>
                    {formData.nearbyLocations.map((item) => (
                      <div
                        key={item.id}
                        className='grid gap-3 rounded-lg border border-border p-3 md:grid-cols-[1fr_180px_auto]'
                      >
                        <div>
                          <Label htmlFor={`location-name-${item.id}`}>
                            Name
                          </Label>
                          <Input
                            id={`location-name-${item.id}`}
                            value={item.name}
                            onChange={(e) =>
                              updateNearbyLocation(
                                item.id,
                                'name',
                                e.target.value,
                              )
                            }
                            placeholder='Mall of Arabia'
                          />
                        </div>
                        <div>
                          <Label htmlFor={`location-distance-${item.id}`}>
                            Distance
                          </Label>
                          <Input
                            id={`location-distance-${item.id}`}
                            value={item.distance}
                            onChange={(e) =>
                              updateNearbyLocation(
                                item.id,
                                'distance',
                                e.target.value,
                              )
                            }
                            placeholder='2 min'
                          />
                        </div>
                        <div className='flex items-end'>
                          <Button
                            type='button'
                            variant='destructive'
                            size='sm'
                            onClick={() =>
                              setFormData((current) => ({
                                ...current,
                                nearbyLocations:
                                  current.nearbyLocations.length > 1
                                    ? current.nearbyLocations.filter(
                                        (location) => location.id !== item.id,
                                      )
                                    : [createLocationRow()],
                              }))
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='space-y-4 rounded-xl border border-border p-4'>
                  <h3 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
                    Payment Plan
                  </h3>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div>
                      <Label htmlFor='downPayment'>Down payment</Label>
                      <Input
                        id='downPayment'
                        value={formData.paymentPlan.downPayment}
                        onChange={(e) =>
                          setFormData((current) => ({
                            ...current,
                            paymentPlan: {
                              ...current.paymentPlan,
                              downPayment: e.target.value,
                            },
                          }))
                        }
                        placeholder='10%'
                      />
                    </div>
                    <div>
                      <Label htmlFor='installments'>Installments</Label>
                      <Input
                        id='installments'
                        value={formData.paymentPlan.installments}
                        onChange={(e) =>
                          setFormData((current) => ({
                            ...current,
                            paymentPlan: {
                              ...current.paymentPlan,
                              installments: e.target.value,
                            },
                          }))
                        }
                        placeholder='6 Years'
                      />
                    </div>
                    <div className='md:col-span-2'>
                      <Label htmlFor='startingPrice'>Starting price</Label>
                      <Input
                        id='startingPrice'
                        value={formData.paymentPlan.startingPrice}
                        onChange={(e) =>
                          setFormData((current) => ({
                            ...current,
                            paymentPlan: {
                              ...current.paymentPlan,
                              startingPrice: e.target.value,
                            },
                          }))
                        }
                        placeholder='3,500,000 EGP'
                      />
                    </div>
                  </div>
                </div>

                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='featured'
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        featured: checked === true,
                      })
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
          <div className='py-12 text-center'>Loading...</div>
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
                    <div className='flex items-start justify-between'>
                      <div>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription>
                          {[
                            project.location,
                            project.type,
                            project.status,
                          ].join(' | ')}
                          {project.featured ? (
                            <span className='ml-2 text-yellow-600'>
                              Featured
                            </span>
                          ) : null}
                        </CardDescription>
                      </div>
                      <div className='flex gap-2'>
                        <Button
                          variant='outline'
                          size='icon'
                          onClick={() => void handleEdit(project)}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='destructive'
                          size='icon'
                          onClick={() => void handleDelete(project.id)}
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
