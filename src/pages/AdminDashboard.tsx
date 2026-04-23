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
  Mail,
  LogOut,
  Newspaper,
  MessagesSquare,
} from 'lucide-react';
import { adminFetch } from '@/lib/adminApi';

type RecentApplication = {
  id: string;
  jobTitle: string;
  name: string;
  status: string;
  createdAt: string;
};

type RecentContactMessage = {
  id: string;
  name: string;
  email: string;
  projectTitle: string | null;
  message: string;
  createdAt: string;
};

type RecentProjectInquiry = {
  id: string;
  name: string;
  email: string;
  projectTitle: string | null;
  message: string;
  createdAt: string;
};

type AdminUser = {
  id: string;
  email: string;
  name: string;
};

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [recentApplications, setRecentApplications] = useState<
    RecentApplication[]
  >([]);
  const [recentMessages, setRecentMessages] = useState<RecentContactMessage[]>(
    [],
  );
  const [recentProjectInquiries, setRecentProjectInquiries] = useState<
    RecentProjectInquiry[]
  >([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [projectInquiriesLoading, setProjectInquiriesLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await adminFetch('/api/auth/me');

        if (!response.ok) {
          navigate('/admin/login');
          return;
        }

        const data = await response.json();
        setAdmin(data.admin || null);
      } catch {
        navigate('/admin/login');
      }
    };

    void fetchAdmin();
  }, [navigate]);

  useEffect(() => {
    const fetchRecentApplications = async () => {
      try {
        const response = await adminFetch('/api/job-applications/admin/all');

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

  useEffect(() => {
    const fetchRecentProjectInquiries = async () => {
      try {
        const response = await adminFetch('/api/project-inquiries/admin/all');

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setRecentProjectInquiries(
          Array.isArray(data) ? data.slice(0, 4) : [],
        );
      } finally {
        setProjectInquiriesLoading(false);
      }
    };

    fetchRecentProjectInquiries();
  }, []);

  useEffect(() => {
    const fetchRecentMessages = async () => {
      try {
        const response = await adminFetch('/api/contact-messages/admin/all');

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setRecentMessages(Array.isArray(data) ? data.slice(0, 4) : []);
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchRecentMessages();
  }, []);

  const handleLogout = async () => {
    try {
      await adminFetch('/api/auth/logout', { method: 'POST' });
    } finally {
      navigate('/admin/login');
    }
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
    {
      title: 'Contact Messages',
      description: 'Review and export messages from the contact page',
      icon: Mail,
      link: '/admin/contact-messages',
      color: 'text-rose-500',
    },
    {
      title: 'Project Inquiries',
      description: 'Review and export leads from project pages',
      icon: MessagesSquare,
      link: '/admin/project-inquiries',
      color: 'text-cyan-500',
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
                      <div className={`p-3   rounded-lg ${card.color}`}>
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
              <h2 className='text-2xl font-bold'>Recent Project Inquiries</h2>
              <p className='text-muted-foreground'>
                The latest leads submitted from project detail pages
              </p>
            </div>
            <Link to='/admin/project-inquiries'>
              <Button variant='outline'>View all</Button>
            </Link>
          </div>

          {projectInquiriesLoading ? (
            <div className='rounded-sm border border-border bg-card p-6 text-center text-muted-foreground'>
              Loading project inquiries...
            </div>
          ) : recentProjectInquiries.length === 0 ? (
            <div className='rounded-sm border border-border bg-card p-6 text-center text-muted-foreground'>
              No project inquiries yet.
            </div>
          ) : (
            <div className='grid gap-4'>
              {recentProjectInquiries.map((inquiry) => (
                <Card key={inquiry.id}>
                  <CardHeader>
                    <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
                      <div>
                        <CardTitle className='text-lg'>
                          {inquiry.name}
                        </CardTitle>
                        <CardDescription>
                          {inquiry.projectTitle || 'Project inquiry'}
                        </CardDescription>
                      </div>
                      <span className='text-sm uppercase tracking-wide text-muted-foreground'>
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-2 text-sm text-muted-foreground'>
                    <div>{inquiry.email}</div>
                    <div>{inquiry.message}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
                        {application.status.replace(/_/g, ' ')}
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

        <div className='mt-10'>
          <div className='mb-4 flex items-center justify-between gap-4'>
            <div>
              <h2 className='text-2xl font-bold'>Recent Contact Messages</h2>
              <p className='text-muted-foreground'>
                The latest messages submitted through the contact form
              </p>
            </div>
            <Link to='/admin/contact-messages'>
              <Button variant='outline'>View all</Button>
            </Link>
          </div>

          {messagesLoading ? (
            <div className='rounded-sm border border-border bg-card p-6 text-center text-muted-foreground'>
              Loading messages...
            </div>
          ) : recentMessages.length === 0 ? (
            <div className='rounded-sm border border-border bg-card p-6 text-center text-muted-foreground'>
              No contact messages yet.
            </div>
          ) : (
            <div className='grid gap-4'>
              {recentMessages.map((message) => (
                <Card key={message.id}>
                  <CardHeader>
                    <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
                      <div>
                        <CardTitle className='text-lg'>
                          {message.name}
                        </CardTitle>
                        <CardDescription>
                          {message.projectTitle || 'General inquiry'}
                        </CardDescription>
                      </div>
                      <span className='text-sm uppercase tracking-wide text-muted-foreground'>
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-2 text-sm text-muted-foreground'>
                    <div>{message.email}</div>
                    <div>{message.message}</div>
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
