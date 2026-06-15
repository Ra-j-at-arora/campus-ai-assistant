"use client";

import { useAuthStore } from '@/stores/authStore';
import { LogOut, User, Mail, Shield, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 transition-colors duration-200">
      <div>
        <h1 className="text-3xl font-bold text-[#111827] dark:text-slate-50">Profile Settings</h1>
        <p className="text-[#6B7280] dark:text-slate-400 mt-1 text-sm">Manage your account and preferences.</p>
      </div>

      <div className="bg-[#FFFFFF] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] dark:shadow-none overflow-hidden transition-colors duration-200">
        <div className="px-6 py-6 sm:px-8 flex items-center justify-between border-b border-[#E5E7EB] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 transition-colors">
          <div className="flex items-center space-x-5">
            <div className="h-16 w-16 bg-indigo-100 dark:bg-indigo-500/10 text-[#4F46E5] dark:text-indigo-400 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-white dark:border-slate-800 shadow-sm transition-colors">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#111827] dark:text-slate-50">
                {user?.name || 'Guest User'}
              </h3>
              <p className="text-sm text-[#6B7280] dark:text-slate-400 font-medium">
                {user?.role === 'ADMIN' ? 'Administrator Account' : 'Student Account'}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 sm:p-8 space-y-8">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-xs font-semibold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider flex items-center mb-2">
                <User className="w-4 h-4 mr-2 text-[#4F46E5] dark:text-indigo-400" /> Full name
              </dt>
              <dd className="text-base text-[#111827] dark:text-slate-50 font-medium px-1">{user?.name || 'N/A'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-xs font-semibold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider flex items-center mb-2">
                <Mail className="w-4 h-4 mr-2 text-[#4F46E5] dark:text-indigo-400" /> Email address
              </dt>
              <dd className="text-base text-[#111827] dark:text-slate-50 font-medium px-1">{user?.email || 'N/A'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-xs font-semibold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider flex items-center mb-2">
                <Shield className="w-4 h-4 mr-2 text-[#4F46E5] dark:text-indigo-400" /> Role
              </dt>
              <dd className="mt-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-emerald-500/10 text-[#14B8A6] dark:text-emerald-400 border border-teal-100 dark:border-emerald-500/20">
                  {user?.role || 'STUDENT'}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={logout}
          className="inline-flex items-center px-6 py-2.5 border border-[#E5E7EB] dark:border-slate-700 shadow-sm text-sm font-semibold rounded-lg text-[#111827] dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-[#F8FAFC] dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E5E7EB] dark:focus:ring-slate-700 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2 text-[#6B7280] dark:text-slate-400" />
          Sign out
        </button>
      </div>
    </div>
  );
}
