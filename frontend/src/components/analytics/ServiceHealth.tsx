"use client";

import { useEffect, useState } from 'react';
import { analyticsService } from '@/services/analyticsService';
import { Activity, CheckCircle2, XCircle } from 'lucide-react';

export const ServiceHealth = () => {
  const [services, setServices] = useState([
    { name: 'Library', id: 'library', status: 'checking', latency: 0 },
    { name: 'Events', id: 'events', status: 'checking', latency: 0 },
    { name: 'Cafeteria', id: 'cafeteria', status: 'checking', latency: 0 },
    { name: 'Academic', id: 'academic', status: 'checking', latency: 0 },
    { name: 'AI Service', id: 'ai', status: 'checking', latency: 0 },
  ]);

  useEffect(() => {
    let mounted = true;
    
    const checkHealth = async () => {
      const results = await Promise.all(
        services.map(async (service) => {
          const res = await analyticsService.getServiceHealth(service.id);
          return { ...service, status: res.status, latency: res.latency };
        })
      );
      if (mounted) setServices(results);
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-[#FFFFFF] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-xl p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors duration-200 h-full">
      <div className="flex items-center mb-6">
        <Activity className="w-5 h-5 text-[#4F46E5] dark:text-indigo-400 mr-2" />
        <h3 className="font-semibold text-[#111827] dark:text-slate-50">Service Health</h3>
      </div>
      <div className="space-y-4">
        {services.map(s => (
          <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-700 transition-colors">
            <div className="flex items-center">
              {s.status === 'healthy' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3" />
              ) : s.status === 'checking' ? (
                <div className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-[#4F46E5] animate-spin mr-3"></div>
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mr-3" />
              )}
              <span className="font-medium text-sm text-[#111827] dark:text-slate-50">{s.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${s.status === 'healthy' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : s.status === 'checking' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
                {s.status.toUpperCase()}
              </span>
              <span className="text-xs text-[#6B7280] dark:text-slate-400 font-mono w-12 text-right">
                {s.status === 'checking' ? '--' : `${s.latency}ms`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
