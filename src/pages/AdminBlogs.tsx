import { useEffect, useMemo, useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { adminFetch } from '@/lib/adminApi';

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  tags: string[];
  category: string;
  authorName: string;
  isFeatured: boolean;
  readingTime: number;
  publishedAt: string;
};

type PostForm = {
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  tags: string;
  category: string;
  authorName: string;
  isFeatured: boolean;
  readingTime: string;
};

const initialForm: PostForm = {
  title: '',
  excerpt: '',
  content: '',
  coverImageUrl: '',
  tags: '',
  category: 'Market Insights',
  authorName: '',
  isFeatured: false,
  readingTime: '5',
};

const parseTags = (input: string) =>
  input
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

export default function AdminBlogs() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<PostForm>(initialForm);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    void fetchPosts();
  }, []);

  const sortedPosts = useMemo(
    () =>
      [...posts].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      ),
    [posts],
  );

  const fetchPosts = async () => {
    try {
      const response = await adminFetch('/api/posts/admin/all');

      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }

      const data = await response.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch blog posts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingPost(null);
    setCoverImageFile(null);
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setCoverImageFile(null);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImageUrl: post.coverImageUrl || '',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
      category: post.category,
      authorName: post.authorName,
      isFeatured: post.isFeatured,
      readingTime: String(post.readingTime || 5),
    });
    setDialogOpen(true);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Delete this blog post?')) {
      return;
    }

    try {
      const response = await adminFetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete blog post');
      }

      toast({
        title: 'Deleted',
        description: 'Blog post deleted successfully',
      });
      fetchPosts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete blog post',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = new FormData();
    payload.append('title', formData.title.trim());
    payload.append('excerpt', formData.excerpt.trim());
    payload.append('content', formData.content.trim());
    payload.append('existingCoverImageUrl', formData.coverImageUrl.trim());
    payload.append('tags', JSON.stringify(parseTags(formData.tags)));
    payload.append('category', formData.category.trim());
    payload.append('authorName', formData.authorName.trim());
    payload.append('isFeatured', String(formData.isFeatured));
    payload.append('readingTime', String(Number(formData.readingTime) || 5));

    if (coverImageFile) {
      payload.append('coverImage', coverImageFile);
    }

    try {
      const endpoint = editingPost
        ? `/api/posts/${editingPost.id}`
        : '/api/posts';
      const method = editingPost ? 'PUT' : 'POST';

      const response = await adminFetch(endpoint, {
        method,
        body: payload,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to save blog post');
      }

      toast({
        title: 'Success',
        description: `Blog post ${editingPost ? 'updated' : 'created'} successfully`,
      });

      setDialogOpen(false);
      resetForm();
      fetchPosts();
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to save blog post',
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
              <h1 className='text-3xl font-bold'>Manage Blogs</h1>
              <p className='text-muted-foreground'>
                Create, edit, and remove blog posts
              </p>
            </div>
          </div>

          <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                Add Blog
              </Button>
            </DialogTrigger>
            <DialogContent className='max-h-[90vh] max-w-3xl overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>
                  {editingPost ? 'Edit Blog Post' : 'Create Blog Post'}
                </DialogTitle>
                <DialogDescription>
                  Fill all required content fields before publishing.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <Label htmlFor='blog-title'>Title</Label>
                  <Input
                    id='blog-title'
                    required
                    value={formData.title}
                    onChange={(event) =>
                      setFormData({ ...formData, title: event.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor='blog-excerpt'>Excerpt</Label>
                  <Textarea
                    id='blog-excerpt'
                    required
                    rows={3}
                    value={formData.excerpt}
                    onChange={(event) =>
                      setFormData({ ...formData, excerpt: event.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor='blog-content'>Content (Markdown)</Label>
                  <Textarea
                    id='blog-content'
                    required
                    rows={10}
                    value={formData.content}
                    onChange={(event) =>
                      setFormData({ ...formData, content: event.target.value })
                    }
                  />
                </div>

                <div className='grid gap-4 sm:grid-cols-2'>
                  <div>
                    <Label htmlFor='blog-category'>Category</Label>
                    <Input
                      id='blog-category'
                      required
                      value={formData.category}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          category: event.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='blog-author'>Author</Label>
                    <Input
                      id='blog-author'
                      required
                      value={formData.authorName}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          authorName: event.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className='grid gap-4 sm:grid-cols-2'>
                  <div>
                    <Label htmlFor='blog-tags'>Tags (comma separated)</Label>
                    <Input
                      id='blog-tags'
                      value={formData.tags}
                      onChange={(event) =>
                        setFormData({ ...formData, tags: event.target.value })
                      }
                      placeholder='Luxury, Dubai, Investment'
                    />
                  </div>
                  <div>
                    <Label htmlFor='blog-reading-time'>
                      Reading Time (minutes)
                    </Label>
                    <Input
                      id='blog-reading-time'
                      type='number'
                      min='1'
                      value={formData.readingTime}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          readingTime: event.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor='blog-cover'>Cover image</Label>
                  <Input
                    id='blog-cover'
                    type='file'
                    accept='image/*'
                    onChange={(event) =>
                      setCoverImageFile(event.target.files?.[0] || null)
                    }
                  />
                  <p className='mt-2 text-xs text-muted-foreground'>
                    {coverImageFile
                      ? `Selected file: ${coverImageFile.name}`
                      : formData.coverImageUrl
                        ? 'Keeping the existing cover image unless you choose a new file.'
                        : 'Choose an image from your computer.'}
                  </p>
                </div>

                <div className='flex items-center gap-2'>
                  <Checkbox
                    id='blog-featured'
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isFeatured: checked === true })
                    }
                  />
                  <Label htmlFor='blog-featured' className='cursor-pointer'>
                    Featured post
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
                    {editingPost ? 'Update' : 'Create'}
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
            {sortedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
              >
                <Card>
                  <CardHeader>
                    <div className='flex items-start justify-between gap-4'>
                      <div>
                        <CardTitle>{post.title}</CardTitle>
                        <CardDescription>
                          {post.category} • {post.authorName} •{' '}
                          {post.readingTime} min read
                          {post.isFeatured ? ' • Featured' : ''}
                        </CardDescription>
                      </div>
                      <div className='flex gap-2'>
                        <Button
                          variant='outline'
                          size='icon'
                          onClick={() => handleEdit(post)}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='destructive'
                          size='icon'
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className='mb-2 text-sm text-muted-foreground'>
                      {post.excerpt}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      Published {new Date(post.publishedAt).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {!sortedPosts.length ? (
              <div className='rounded-sm border border-border bg-card py-16 text-center text-muted-foreground'>
                No blog posts found.
              </div>
            ) : null}
          </div>
        )}
      </div>
    </Layout>
  );
}
