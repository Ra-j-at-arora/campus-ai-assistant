"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { apiClient } from '@/services/apiClient';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      const response = await apiClient.post('/auth/login', data);
      const { user, token } = response.data.data;
      login(user, token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-center transition-colors">
          <span className="mr-2">⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#111827] dark:text-slate-200 mb-1">Email address</label>
          <input
            {...register('email')}
            className="block w-full rounded-lg border border-[#E5E7EB] dark:border-slate-600 bg-[#FFFFFF] dark:bg-slate-900 px-4 py-2.5 text-[#111827] dark:text-slate-50 focus:border-[#4F46E5] dark:focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] dark:focus:ring-indigo-500 transition-colors shadow-sm"
            placeholder="you@campus.edu"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111827] dark:text-slate-200 mb-1">Password</label>
          <input
            {...register('password')}
            type="password"
            className="block w-full rounded-lg border border-[#E5E7EB] dark:border-slate-600 bg-[#FFFFFF] dark:bg-slate-900 px-4 py-2.5 text-[#111827] dark:text-slate-50 focus:border-[#4F46E5] dark:focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] dark:focus:ring-indigo-500 transition-colors shadow-sm"
            placeholder="••••••••"
          />
          {errors.password && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#4F46E5] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F46E5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-[#6B7280] dark:text-slate-400 mt-6 transition-colors">
        Don't have an account?{' '}
        <Link href="/register" className="font-medium text-[#4F46E5] dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
