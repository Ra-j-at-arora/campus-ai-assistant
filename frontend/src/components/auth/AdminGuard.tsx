import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role !== 'ADMIN') {
      router.push('/dashboard');
    } else {
      setAuthorized(true);
    }
  }, [isAuthenticated, user, router]);

  if (!authorized) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
};
