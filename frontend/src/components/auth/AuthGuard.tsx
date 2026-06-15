"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, isLoading, router]);

  if (!mounted || isLoading) {
    return <div className="flex h-screen items-center justify-center bg-[#F8FAFC] dark:bg-slate-900">
      <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-[#4F46E5] animate-spin"></div>
    </div>;
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
};
