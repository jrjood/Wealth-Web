import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { adminFetch } from '@/lib/adminApi';

type ProtectedAdminRouteProps = {
  children: ReactNode;
};

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateSession = async () => {
      try {
        const response = await adminFetch('/api/auth/me');
        setIsAuthenticated(response.ok);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    void validateSession();
  }, []);

  if (isLoading) {
    return (
      <div className='min-h-[40vh] grid place-items-center'>Loading...</div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/admin/login' replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
