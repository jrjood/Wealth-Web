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
import {
  Briefcase,
  FileText,
  FolderKanban,
  LogOut,
  Newspaper,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

type RecentApplication = {
  id: string;
  jobTitle: string;
  name: string;
  status: string;
  createdAt: string;
};

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<any>(null);
  const [recentApplications, setRecentApplications] = useState<
    RecentApplication[]
  >([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');

    if (!token || !adminUser) {
      navigate('/admin/login');
      return;
    }

    setAdmin(JSON.parse(adminUser));
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      return;
    }

    const fetchRecentApplications = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/job-applications/admin/all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setRecentApplications(Array.isArray(data) ? data.slice(0, 4) : []);
      } finally {
        setApplicationsLoading(false);
      }
    };

    fetchRecentApplications();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  if (!admin) {
    return null;
  }

  const cards = [
    {
      title: 'Manage Projects',
      description: 'Add, edit, or remove property projects',
      icon: FolderKanban,
      link: '/admin/projects',
      color: 'text-blue-500',
    },
    {
      title: 'Manage Jobs',
      description: 'Add, edit, or remove job openings',
      icon: Briefcase,
      link: '/admin/jobs',
      color: 'text-green-500',
    },
    {
      title: 'Job Applications',
      description: 'Review applications and download CVs',
      icon: FileText,
      link: '/admin/applications',
      color: 'text-amber-500',
    },
    {
      title: 'Manage Blogs',
      description: 'Create, edit, or remove blog posts',
      icon: Newspaper,
      link: '/admin/blogs',
      color: 'text-violet-500',
    },
  ];

  return (
    <Layout showFooter={false}>
      <div className='container mx-auto px-4 py-12'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold mb-2'>Admin Dashboard</h1>
            <p className='text-muted-foreground'>Welcome back, {admin.name}</p>
          </div>
          <Button variant='outline' onClick={handleLogout}>
            <LogOut className='mr-2 h-4 w-4' />
            Logout
          </Button>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={card.link}>
                <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
                  <CardHeader>
                    <div className='flex items-center gap-4'>
                      <div
                        className={`p-3 bg-primary/10 rounded-lg ${card.color}`}
                      >
                        <card.icon className='h-6 w-6' />
                      </div>
                      <div>
                        <CardTitle>{card.title}</CardTitle>
                        <CardDescription>{card.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className='mt-10'>
          <div className='mb-4 flex items-center justify-between gap-4'>
            <div>
              <h2 className='text-2xl font-bold'>Recent Job Applications</h2>
              <p className='text-muted-foreground'>
                The latest submissions from the careers page
              </p>
            </div>
            <Link to='/admin/applications'>
              <Button variant='outline'>View all</Button>
            </Link>
          </div>

          {applicationsLoading ? (
            <div className='rounded-sm border border-border bg-card p-6 text-center text-muted-foreground'>
              Loading applications...
            </div>
          ) : recentApplications.length === 0 ? (
            <div className='rounded-sm border border-border bg-card p-6 text-center text-muted-foreground'>
              No applications yet.
            </div>
          ) : (
            <div className='grid gap-4'>
              {recentApplications.map((application) => (
                <Card key={application.id}>
                  <CardHeader>
                    <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
                      <div>
                        <CardTitle className='text-lg'>
                          {application.name}
                        </CardTitle>
                        <CardDescription>
                          {application.jobTitle}
                        </CardDescription>
                      </div>
                      <span className='text-sm uppercase tracking-wide text-muted-foreground'>
                        {application.status.replaceAll('_', ' ')}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className='text-sm text-muted-foreground'>
                    Submitted {new Date(application.createdAt).toLocaleString()}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
