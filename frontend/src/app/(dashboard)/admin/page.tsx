"use client";

import { useEffect, useState } from 'react';
import { AdminGuard } from '@/components/auth/AdminGuard';
import { analyticsService } from '@/services/analyticsService';
import { ServiceHealth } from '@/components/analytics/ServiceHealth';
import { Download, Search, ChevronLeft, ChevronRight, Users, MessageSquare, Zap, Target } from 'lucide-react';
import dynamic from 'next/dynamic';

const TrendsChart = dynamic(() => import('@/components/analytics/TrendsChart'), { ssr: false, loading: () => <div className="animate-pulse bg-slate-100 dark:bg-slate-800 w-full h-full rounded-lg"></div> });
const ServiceDistChart = dynamic(() => import('@/components/analytics/ServiceDistChart'), { ssr: false, loading: () => <div className="animate-pulse bg-slate-100 dark:bg-slate-800 w-full h-full rounded-lg"></div> });

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<any>(null);
  const [trends, setTrends] = useState<any>([]);
  const [serviceDist, setServiceDist] = useState<any>([]);
  
  // Table state
  const [logs, setLogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    loadTableData();
  }, [page, search]);

  const loadDashboardData = async () => {
    try {
      const [overviewData, trendsData, distData] = await Promise.all([
        analyticsService.getOverview(),
        analyticsService.getQueryTrends(),
        analyticsService.getServiceDistribution()
      ]);
      setOverview(overviewData);
      setTrends(trendsData);
      setServiceDist(distData);
    } catch (e) {
      console.error(e);
    }
  };

  const loadTableData = async () => {
    try {
      const res = await analyticsService.getQueryExplorer(page, 10, search);
      setLogs(res.data);
      setTotalPages(res.pagination.pages);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportCSV = () => {
    if (!logs.length) return;
    const headers = ['Timestamp', 'User ID', 'Query', 'Intent', 'Tools', 'Service', 'Response Time (ms)', 'Success'];
    const csvContent = [
      headers.join(','),
      ...logs.map(l => [
        new Date(l.timestamp).toISOString(),
        l.userId,
        `"${l.queryText.replace(/"/g, '""')}"`,
        l.intent,
        `"${l.toolsCalled.join(', ')}"`,
        l.serviceCategory,
        l.responseTime,
        l.success
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_export_${new Date().getTime()}.csv`;
    a.click();
  };

  if (!overview) return <AdminGuard><div className="flex h-64 items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-[#4F46E5] animate-spin"></div></div></AdminGuard>;

  return (
    <AdminGuard>
      <div className="space-y-6 max-w-[1200px] mx-auto py-4 transition-colors duration-200 pb-12">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#111827] dark:text-slate-50">Analytics & Insights</h1>
            <p className="text-[#6B7280] dark:text-slate-400 mt-1 text-sm">Monitor AI usage, system performance, and user queries.</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard icon={<MessageSquare />} title="Total AI Queries" value={overview.totalQueries} color="text-indigo-600 dark:text-indigo-400" bg="bg-indigo-50 dark:bg-indigo-500/10" />
          <KPICard icon={<Users />} title="Active Users" value={overview.activeUsers} color="text-teal-600 dark:text-teal-400" bg="bg-teal-50 dark:bg-teal-500/10" />
          <KPICard icon={<Target />} title="Success Rate" value={`${overview.successRate}%`} color={overview.successRate > 90 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"} bg={overview.successRate > 90 ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-amber-50 dark:bg-amber-500/10"} />
          <KPICard icon={<Zap />} title="Avg Latency" value={`${overview.avgResponseTime}ms`} color="text-purple-600 dark:text-purple-400" bg="bg-purple-50 dark:bg-purple-500/10" />
        </div>

        {/* Middle Section: Charts & Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-[#FFFFFF] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-xl p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors duration-200">
            <h3 className="text-base font-semibold mb-6 text-[#111827] dark:text-slate-50">Query Trends</h3>
            <div className="h-72 w-full">
              <TrendsChart trends={trends} />
            </div>
          </div>

          <div className="bg-[#FFFFFF] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-xl p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors duration-200 relative pb-12">
            <h3 className="text-base font-semibold mb-6 text-[#111827] dark:text-slate-50">Service Distribution</h3>
            <div className="h-64 w-full">
              <ServiceDistChart serviceDist={serviceDist} />
            </div>
          </div>

        </div>

        {/* AI Performance & Service Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#FFFFFF] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-xl p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors duration-200">
            <h3 className="text-base font-semibold mb-6 text-[#111827] dark:text-slate-50 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-[#4F46E5] dark:text-indigo-400" /> AI Performance
            </h3>
            <div className="space-y-4">
              <MetricRow label="Tool Failure Rate" value={`${overview.toolFailureRate}%`} />
              <MetricRow label="Multi-Tool Queries" value={overview.multiToolQueries} />
              <MetricRow label="Most Used Service" value={overview.mostUsedService} />
            </div>
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-[#111827] dark:text-slate-300 mb-4">Top Questions</h4>
              <ul className="space-y-3">
                {overview.topQuestions.slice(0, 4).map((q: any, i: number) => (
                  <li key={i} className="flex justify-between items-start text-sm">
                    <span className="text-[#6B7280] dark:text-slate-400 line-clamp-1 flex-1 pr-4">"{q.query}"</span>
                    <span className="font-medium text-[#111827] dark:text-slate-200 bg-[#F8FAFC] dark:bg-slate-900 px-2 py-0.5 rounded">{q.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ServiceHealth />
        </div>

        {/* Query Explorer */}
        <div className="bg-[#FFFFFF] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors duration-200 overflow-hidden">
          <div className="p-6 border-b border-[#E5E7EB] dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-semibold text-[#111827] dark:text-slate-50">Query Explorer</h3>
            <div className="flex items-center w-full sm:w-auto space-x-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search queries..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-[#F8FAFC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4F46E5] text-[#111827] dark:text-slate-50"
                />
              </div>
              <button 
                onClick={handleExportCSV}
                className="flex items-center px-3 py-2 bg-white dark:bg-slate-700 border border-[#E5E7EB] dark:border-slate-600 rounded-lg text-sm font-medium text-[#6B7280] dark:text-slate-200 hover:text-[#111827] hover:bg-gray-50 dark:hover:text-white dark:hover:bg-slate-600 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] dark:bg-slate-900/50 text-xs uppercase tracking-wider text-[#6B7280] dark:text-slate-400 border-b border-[#E5E7EB] dark:border-slate-700">
                  <th className="px-6 py-4 font-semibold">Timestamp</th>
                  <th className="px-6 py-4 font-semibold">Query</th>
                  <th className="px-6 py-4 font-semibold">Service</th>
                  <th className="px-6 py-4 font-semibold">Latency</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] dark:divide-slate-700">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-[#6B7280] dark:text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#111827] dark:text-slate-200 max-w-xs truncate" title={log.queryText}>
                      {log.queryText}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-[#4F46E5] dark:bg-indigo-500/10 dark:text-indigo-400">
                        {log.serviceCategory}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B7280] dark:text-slate-400 font-mono">
                      {log.responseTime}ms
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {log.success ? (
                        <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></div>Success</span>
                      ) : (
                        <span className="inline-flex items-center text-red-600 dark:text-red-400"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></div>Failed</span>
                      )}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-[#6B7280] dark:text-slate-400">
                      No queries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="p-4 border-t border-[#E5E7EB] dark:border-slate-700 flex items-center justify-between bg-[#F8FAFC] dark:bg-slate-900/50">
            <span className="text-sm text-[#6B7280] dark:text-slate-400">
              Page {page} of {totalPages || 1}
            </span>
            <div className="flex space-x-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-md border border-[#E5E7EB] dark:border-slate-600 text-[#6B7280] dark:text-slate-400 disabled:opacity-50 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-md border border-[#E5E7EB] dark:border-slate-600 text-[#6B7280] dark:text-slate-400 disabled:opacity-50 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </AdminGuard>
  );
}

const KPICard = ({ icon, title, value, color, bg }: any) => (
  <div className="bg-[#FFFFFF] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors duration-200">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-medium text-[#6B7280] dark:text-slate-400 text-sm">{title}</h3>
      <div className={`p-2 rounded-lg ${bg} ${color}`}>
        {icon}
      </div>
    </div>
    <div className="text-3xl font-bold text-[#111827] dark:text-slate-50">{value}</div>
  </div>
);

const MetricRow = ({ label, value }: any) => (
  <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB] dark:border-slate-700 last:border-0">
    <span className="text-sm text-[#6B7280] dark:text-slate-400">{label}</span>
    <span className="text-sm font-semibold text-[#111827] dark:text-slate-200">{value}</span>
  </div>
);
