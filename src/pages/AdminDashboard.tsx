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
  ArrowRight,
  CalendarClock,
  ClipboardList,
  FilePenLine,
  Inbox,
  LayoutGrid,
  LogOut,
  MessageCircleMore,
  UserRoundCheck,
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
  const [applicationsTotal, setApplicationsTotal] = useState(0);
  const [messagesTotal, setMessagesTotal] = useState(0);
  const [projectInquiriesTotal, setProjectInquiriesTotal] = useState(0);
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
        const applications = Array.isArray(data) ? data : [];
        setApplicationsTotal(applications.length);
        setRecentApplications(applications.slice(0, 4));
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
        const inquiries = Array.isArray(data) ? data : [];
        setProjectInquiriesTotal(inquiries.length);
        setRecentProjectInquiries(inquiries.slice(0, 4));
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
        const messages = Array.isArray(data) ? data : [];
        setMessagesTotal(messages.length);
        setRecentMessages(messages.slice(0, 4));
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

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat('en', {
      day: '2-digit',
      month: 'short',
    }).format(new Date(date));

  const metricCards = [
    {
      title: 'Project Inquiries',
      value: projectInquiriesTotal,
      description: 'Project page leads',
      icon: MessageCircleMore,
      loading: projectInquiriesLoading,
      link: '/admin/project-inquiries',
      tone: 'bg-background text-foreground border-border',
    },
    {
      title: 'Contact Messages',
      value: messagesTotal,
      description: 'General contact requests',
      icon: Inbox,
      loading: messagesLoading,
      link: '/admin/contact-messages',
      tone: 'bg-background text-foreground border-border',
    },
    {
      title: 'Job Applications',
      value: applicationsTotal,
      description: 'Careers submissions',
      icon: UserRoundCheck,
      loading: applicationsLoading,
      link: '/admin/applications',
      tone: 'bg-background text-foreground border-border',
    },
  ];

  const managementCards = [
    {
      title: 'Manage Projects',
      description: 'Add, edit, or remove property projects',
      icon: LayoutGrid,
      link: '/admin/projects',
      color: 'text-foreground',
    },
    {
      title: 'Manage Jobs',
      description: 'Add, edit, or remove job openings',
      icon: ClipboardList,
      link: '/admin/jobs',
      color: 'text-foreground',
    },

    {
      title: 'Manage Blogs',
      description: 'Create, edit, or remove blog posts',
      icon: FilePenLine,
      link: '/admin/blogs',
      color: 'text-foreground',
    },
    {
      title: 'Job Applications',
      description: 'Review applications and download CVs',
      icon: UserRoundCheck,
      link: '/admin/applications',
      color: 'text-foreground',
    },
    {
      title: 'Contact Messages',
      description: 'Review and export messages from the contact page',
      icon: Inbox,
      link: '/admin/contact-messages',
      color: 'text-foreground',
    },
    {
      title: 'Project Inquiries',
      description: 'Review and export leads from project pages',
      icon: MessageCircleMore,
      link: '/admin/project-inquiries',
      color: 'text-foreground',
    },
  ];

  const recentSections = [
    {
      title: 'Recent Project Inquiries',
      description: 'Latest leads from project detail pages',
      loading: projectInquiriesLoading,
      empty: 'No project inquiries yet.',
      link: '/admin/project-inquiries',
      items: recentProjectInquiries.map((inquiry) => ({
        id: inquiry.id,
        title: inquiry.name,
        eyebrow: inquiry.projectTitle || 'Project inquiry',
        meta: inquiry.email,
        detail: inquiry.message,
        date: inquiry.createdAt,
      })),
    },
    {
      title: 'Recent Job Applications',
      description: 'Latest submissions from the careers page',
      loading: applicationsLoading,
      empty: 'No applications yet.',
      link: '/admin/applications',
      items: recentApplications.map((application) => ({
        id: application.id,
        title: application.name,
        eyebrow: application.jobTitle,
        meta: application.status.replace(/_/g, ' '),
        detail: `Submitted ${new Date(application.createdAt).toLocaleString()}`,
        date: application.createdAt,
      })),
    },
    {
      title: 'Recent Contact Messages',
      description: 'Latest messages from the contact form',
      loading: messagesLoading,
      empty: 'No contact messages yet.',
      link: '/admin/contact-messages',
      items: recentMessages.map((message) => ({
        id: message.id,
        title: message.name,
        eyebrow: message.projectTitle || 'General inquiry',
        meta: message.email,
        detail: message.message,
        date: message.createdAt,
      })),
    },
  ];

  return (
    <Layout showFooter={false}>
      <div className='min-h-screen bg-[hsl(var(--muted))]'>
        <div className='mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8'>
          <div className='mb-6 flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
            <div className='min-w-0'>
              <h1 className='text-2xl font-black tracking-tight text-foreground md:text-3xl'>
                Dashboard
              </h1>
              <p className='mt-1 text-sm text-muted-foreground'>
                Welcome back, {admin.name}. Review new leads, applications, and
                content controls from one place.
              </p>
            </div>
            <div className='flex flex-col gap-2 sm:items-end'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <CalendarClock className='h-4 w-4' />
                {new Date().toLocaleDateString('en', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
              <Button variant='outline' size='sm' onClick={handleLogout}>
                <LogOut className='h-4 w-4' />
                Logout
              </Button>
            </div>
          </div>

          <div className='grid gap-4 md:grid-cols-3'>
            {metricCards.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
              >
                <Link to={metric.link} className='group block h-full'>
                  <Card className='h-full border-border/80 bg-card shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-[hsl(var(--brand-red-500)/0.28)] hover:shadow-md'>
                    <CardHeader className='flex flex-row items-start justify-between gap-4 space-y-0 pb-3'>
                      <div>
                        <CardDescription className='text-xs font-bold uppercase tracking-[0.14em]'>
                          {metric.title}
                        </CardDescription>
                        <CardTitle className='mt-2 text-3xl font-black'>
                          {metric.loading ? '-' : metric.value}
                        </CardTitle>
                      </div>
                      <div
                        className={`rounded-lg border p-2.5 shadow-sm ${metric.tone}`}
                      >
                        <metric.icon className='h-5 w-5 stroke-[1.8]' />
                      </div>
                    </CardHeader>
                    <CardContent className='flex items-center justify-between text-sm text-muted-foreground'>
                      <span>{metric.description}</span>
                      <ArrowRight className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <section className='mt-6'>
            <div className='mb-3 flex items-end justify-between gap-4'>
              <div>
                <h2 className='text-lg font-black tracking-tight'>
                  Management
                </h2>
                <p className='text-sm text-muted-foreground'>
                  Common admin actions and content areas
                </p>
              </div>
            </div>
            <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
              {managementCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.18 + index * 0.05 }}
                >
                  <Link to={card.link} className='group block h-full'>
                    <Card className='h-full cursor-pointer border-border/80 bg-card shadow-sm transition-[border-color,background-color,box-shadow] duration-300 hover:border-[hsl(var(--brand-red-500)/0.24)] hover:bg-background hover:shadow-md'>
                      <CardHeader className='p-4'>
                        <div className='flex items-start gap-3'>
                          <div
                            className={`rounded-lg border border-border bg-background p-2.5 shadow-sm ${card.color}`}
                          >
                            <card.icon className='h-5 w-5 stroke-[1.8]' />
                          </div>
                          <div className='min-w-0 flex-1'>
                            <CardTitle className='text-base'>
                              {card.title}
                            </CardTitle>
                            <CardDescription className='mt-1 line-clamp-2 text-sm leading-relaxed'>
                              {card.description}
                            </CardDescription>
                          </div>
                          <ArrowRight className='mt-1 h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1' />
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          <section className='mt-6 grid gap-4 xl:grid-cols-3'>
            {recentSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.35 + index * 0.05 }}
              >
                <Card className='h-full border-border/80 bg-card shadow-sm'>
                  <CardHeader className='border-b border-border/70 p-4'>
                    <div className='flex items-start justify-between gap-3'>
                      <div>
                        <CardTitle className='text-base'>
                          {section.title}
                        </CardTitle>
                        <CardDescription className='mt-1'>
                          {section.description}
                        </CardDescription>
                      </div>
                      <Button
                        asChild
                        variant='ghost'
                        size='sm'
                        className='shrink-0'
                      >
                        <Link to={section.link}>View all</Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className='p-0'>
                    {section.loading ? (
                      <div className='grid min-h-44 place-items-center px-4 py-8 text-sm text-muted-foreground'>
                        Loading...
                      </div>
                    ) : section.items.length === 0 ? (
                      <div className='grid min-h-44 place-items-center px-4 py-8 text-center text-sm text-muted-foreground'>
                        {section.empty}
                      </div>
                    ) : (
                      <div className='divide-y divide-border/70'>
                        {section.items.map((item) => (
                          <Link
                            key={item.id}
                            to={section.link}
                            className='group block p-4 transition-colors duration-200 hover:bg-muted/70'
                          >
                            <div className='mb-2 flex items-start justify-between gap-3'>
                              <div className='min-w-0'>
                                <p className='truncate text-sm font-bold text-foreground'>
                                  {item.title}
                                </p>
                                <p className='truncate text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground'>
                                  {item.eyebrow}
                                </p>
                              </div>
                              <span className='shrink-0 rounded-full bg-muted px-2 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted-foreground'>
                                {formatDate(item.date)}
                              </span>
                            </div>
                            <p className='truncate text-xs text-muted-foreground'>
                              {item.meta}
                            </p>
                            <p className='mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground'>
                              {item.detail}
                            </p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </section>
        </div>
      </div>
    </Layout>
  );
}
