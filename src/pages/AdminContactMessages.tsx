import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
import { ArrowLeft, Download, RefreshCw, Rows, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adminFetch } from '@/lib/adminApi';

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectId: string | null;
  projectTitle: string | null;
  message: string;
  createdAt: string;
  updatedAt: string;
};

const escapeCsvValue = (value: string | number | null | undefined) =>
  `"${String(value ?? '')
    .replace(/"/g, '""')
    .replace(/\r\n/g, '\n')
    .replace(/\n/g, ' ')}"`;

export default function AdminContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    void fetchMessages();
  }, []);

  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [messages],
  );

  const fetchMessages = async () => {
    try {
      const response = await adminFetch('/api/contact-messages/admin/all');

      if (!response.ok) {
        throw new Error('Failed to fetch contact messages');
      }

      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch contact messages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = () => {
    if (sortedMessages.length === 0) {
      toast({
        title: 'No data',
        description: 'There are no contact messages to export yet.',
      });
      return;
    }

    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Project ID',
      'Project',
      'Message',
      'Submitted At',
    ];

    const csvRows = sortedMessages.map((message) =>
      [
        message.id,
        message.name,
        message.email,
        message.phone,
        message.projectId || '',
        message.projectTitle || 'General inquiry',
        message.message,
        new Date(message.createdAt).toLocaleString(),
      ]
        .map(escapeCsvValue)
        .join(','),
    );

    const csv = [headers.map(escapeCsvValue).join(','), ...csvRows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const objectUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = `contact-messages-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(objectUrl);
  };

  const deleteMessage = async (messageId: string) => {
    if (!window.confirm('Delete this contact message permanently?')) {
      return;
    }

    try {
      const response = await adminFetch(`/api/contact-messages/${messageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || 'Failed to delete contact message');
      }

      setMessages((current) =>
        current.filter((message) => message.id !== messageId),
      );

      toast({
        title: 'Deleted',
        description: 'Contact message deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to delete message',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Layout showFooter={false}>
        <div className='container mx-auto px-4 py-12 text-center text-muted-foreground'>
          Loading contact messages...
        </div>
      </Layout>
    );
  }

  return (
    <Layout showFooter={false}>
      <div className='container mx-auto px-4 py-12'>
        <div className='mb-8 flex flex-wrap items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <Link to='/admin/dashboard'>
              <Button variant='ghost' size='icon'>
                <ArrowLeft className='h-4 w-4' />
              </Button>
            </Link>
            <div>
              <h1 className='text-3xl font-bold'>Contact Messages</h1>
              <p className='text-muted-foreground'>
                Review messages from the contact page and export them as CSV
              </p>
            </div>
          </div>

          <div className='flex gap-3'>
            <Button variant='outline' onClick={fetchMessages}>
              <RefreshCw className='mr-2 h-4 w-4' />
              Refresh
            </Button>
            <Button onClick={downloadCsv}>
              <Download className='mr-2 h-4 w-4' />
              Download CSV
            </Button>
          </div>
        </div>

        <div className='mb-6 flex items-center gap-3 rounded-sm border border-border bg-card px-4 py-3'>
          <Rows className='h-5 w-5 text-primary' />
          <p className='text-sm text-muted-foreground'>
            Total messages:{' '}
            <span className='font-semibold text-foreground'>
              {sortedMessages.length}
            </span>
          </p>
        </div>

        {sortedMessages.length === 0 ? (
          <div className='rounded-sm border border-border bg-card py-16 text-center'>
            <p className='text-muted-foreground'>No contact messages yet.</p>
          </div>
        ) : (
          <div className='overflow-hidden rounded-sm border border-border bg-card'>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-border text-sm'>
                <thead className='bg-muted/50 text-left uppercase tracking-wide text-muted-foreground'>
                  <tr>
                    <th className='px-4 py-3 font-medium'>Name</th>
                    <th className='px-4 py-3 font-medium'>Email</th>
                    <th className='px-4 py-3 font-medium'>Phone</th>
                    <th className='px-4 py-3 font-medium'>Project</th>
                    <th className='px-4 py-3 font-medium'>Message</th>
                    <th className='px-4 py-3 font-medium'>Submitted</th>
                    <th className='px-4 py-3 font-medium'>Action</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                  {sortedMessages.map((message, index) => (
                    <motion.tr
                      key={message.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.03 }}
                      className='align-top'
                    >
                      <td className='px-4 py-4 font-medium text-foreground'>
                        {message.name}
                      </td>
                      <td className='px-4 py-4 text-muted-foreground'>
                        {message.email}
                      </td>
                      <td className='px-4 py-4 text-muted-foreground'>
                        {message.phone}
                      </td>
                      <td className='px-4 py-4 text-muted-foreground'>
                        {message.projectTitle || 'General inquiry'}
                      </td>
                      <td className='px-4 py-4 text-muted-foreground'>
                        <div className='max-w-[420px] whitespace-pre-wrap break-words'>
                          {message.message}
                        </div>
                      </td>
                      <td className='px-4 py-4 text-muted-foreground'>
                        {new Date(message.createdAt).toLocaleString()}
                      </td>
                      <td className='px-4 py-4 text-muted-foreground'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => deleteMessage(message.id)}
                        >
                          <Trash2 className='mr-2 h-4 w-4' />
                          Delete
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
