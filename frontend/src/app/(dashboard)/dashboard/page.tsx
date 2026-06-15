"use client";

import { useEffect, useState } from 'react';
import { Utensils, Calendar, BookOpen, MessageSquare, ChevronRight, CheckSquare } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { apiClient } from '@/services/apiClient';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      apiClient.get(`/chat/history?userId=${user.id}`).then((res) => {
        // For dashboard, we want newest first, max 5
        const recent = res.data.data.slice(-5).reverse();
        setHistory(recent);
      }).catch(console.error);
    }
  }, [user]);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto py-4 transition-colors duration-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#111827] dark:text-slate-50">Dashboard</h1>
          <p className="text-[#6B7280] dark:text-slate-400 mt-1 text-sm">Welcome back, {user?.name?.split(' ')[0] || 'Nikhil'}! Here's your campus overview.</p>
        </div>
        <Link 
          href="/chat"
          className="inline-flex items-center px-4 py-2 bg-[#4F46E5] text-white rounded-md hover:bg-[#4338CA] transition-colors shadow-sm text-sm font-medium"
        >
          Ask AI Assistant <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Menu Card */}
        <div className="bg-[#FFFFFF] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] dark:shadow-none flex flex-col h-full hover:bg-white dark:hover:bg-slate-700 transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#111827] dark:text-slate-50">Today's Menu</h3>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-[#F59E0B]">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <div className="flex-1">
            <ul className="space-y-3 mt-2 text-sm text-[#6B7280] dark:text-slate-300">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] dark:bg-indigo-400 mt-1.5 mr-3 shrink-0"></span>
                <span>Paneer Butter Masala</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] dark:bg-indigo-400 mt-1.5 mr-3 shrink-0"></span>
                <span>Veg Pulao</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] dark:bg-indigo-400 mt-1.5 mr-3 shrink-0"></span>
                <span>Fruit Salad</span>
              </li>
            </ul>
          </div>
          <Link href="/chat?q=Show+me+today's+full+cafeteria+menu" className="mt-6 text-sm font-medium text-[#14B8A6] dark:text-emerald-400 flex items-center hover:text-teal-600 dark:hover:text-emerald-300">
            Ask AI for full menu <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Events Card */}
        <div className="bg-[#FFFFFF] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] dark:shadow-none flex flex-col h-full hover:bg-white dark:hover:bg-slate-700 transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#111827] dark:text-slate-50">Upcoming Events</h3>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-[#4F46E5] dark:text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex-1">
            <ul className="space-y-3 mt-2 text-sm text-[#6B7280] dark:text-slate-300">
              <li className="flex flex-col border-l-2 border-[#4F46E5] dark:border-indigo-500 pl-3 ml-1">
                <span className="font-medium text-[#111827] dark:text-slate-100">AI/ML Workshop</span>
                <span className="text-xs mt-0.5 text-[#6B7280] dark:text-slate-400">14 Nov, 2024 • 3:00 PM</span>
              </li>
              <li className="flex flex-col border-l-2 border-[#4F46E5] dark:border-indigo-500 pl-3 ml-1 mt-4">
                <span className="font-medium text-[#111827] dark:text-slate-100">Coding Club Meetup</span>
                <span className="text-xs mt-0.5 text-[#6B7280] dark:text-slate-400">16 Nov, 2024 • 5:00 PM</span>
              </li>
            </ul>
          </div>
          <Link href="/chat?q=Show+me+all+upcoming+campus+events" className="mt-6 text-sm font-medium text-[#14B8A6] dark:text-emerald-400 flex items-center hover:text-teal-600 dark:hover:text-emerald-300">
            Ask AI for all events <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Deadlines Card */}
        <div className="bg-[#FFFFFF] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] dark:shadow-none flex flex-col h-full hover:bg-white dark:hover:bg-slate-700 transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#111827] dark:text-slate-50">Academic Deadlines</h3>
            <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-[#14B8A6] dark:text-teal-400">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex-1">
            <ul className="space-y-3 mt-2 text-sm text-[#6B7280] dark:text-slate-300">
              <li className="flex flex-col border-l-2 border-[#14B8A6] dark:border-teal-500 pl-3 ml-1">
                <span className="font-medium text-[#111827] dark:text-slate-100">DSA Assignment</span>
                <span className="text-xs mt-0.5 text-[#6B7280] dark:text-slate-400">Due: 15 Nov, 2024</span>
              </li>
              <li className="flex flex-col border-l-2 border-[#14B8A6] dark:border-teal-500 pl-3 ml-1 mt-4">
                <span className="font-medium text-[#111827] dark:text-slate-100">Mid Sem Exams</span>
                <span className="text-xs mt-0.5 text-[#6B7280] dark:text-slate-400">Start: 25 Nov, 2024</span>
              </li>
            </ul>
          </div>
          <Link href="/chat?q=Show+me+all+academic+deadlines" className="mt-6 text-sm font-medium text-[#14B8A6] dark:text-emerald-400 flex items-center hover:text-teal-600 dark:hover:text-emerald-300">
            Ask AI for all deadlines <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

      </div>
      
      {/* Bottom Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
        
        {/* Recent Activity */}
        <div className="lg:col-span-3 bg-[#FFFFFF] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-xl p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors duration-200">
          <h3 className="text-base font-semibold mb-6 text-[#111827] dark:text-slate-50">Recent Activity</h3>
          <div className="space-y-6">
            {history.length > 0 ? history.map((msg: any, i: number) => (
              <div key={i} className="flex items-start justify-between group">
                <div className="flex items-center truncate mr-4">
                  <div className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-[#4F46E5] dark:text-indigo-400 rounded-md mr-4 shrink-0 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-[#111827] dark:text-slate-200 group-hover:text-[#4F46E5] dark:group-hover:text-indigo-400 transition-colors truncate">
                    {msg.role === 'user' ? 'You asked: ' : 'AI answered: '}
                    {msg.content.substring(0, 60)}{msg.content.length > 60 ? '...' : ''}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-[#6B7280] dark:text-slate-400">No recent activity found. Start a conversation!</p>
            )}
          </div>
          <Link href="/chat" className="mt-8 text-sm font-medium text-[#14B8A6] dark:text-emerald-400 flex items-center hover:text-teal-600 dark:hover:text-emerald-300">
            View all activity <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        {/* AI Assistant Ready */}
        <div className="lg:col-span-2 bg-[#FFFFFF] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-xl p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] dark:shadow-none flex flex-col justify-between text-center items-center transition-colors duration-200">
          <div className="w-full">
            <h3 className="text-xl font-bold mb-3 text-[#4F46E5] dark:text-indigo-400">Your AI Assistant is ready</h3>
            <p className="text-sm text-[#6B7280] dark:text-slate-400 mb-6 leading-relaxed px-4">
              Ask anything about books, events, menu, exams, and more. I'm here to help!
            </p>
            
            {/* Simple CSS Illustration replacement */}
            <div className="relative h-32 w-full mb-8 flex items-center justify-center">
              <div className="absolute w-24 h-24 bg-indigo-50 dark:bg-indigo-500/10 rounded-full blur-xl"></div>
              <div className="relative bg-white dark:bg-slate-700 border border-[#E5E7EB] dark:border-slate-600 p-4 rounded-2xl shadow-sm z-10 flex items-center space-x-2 transition-colors">
                <MessageSquare className="w-6 h-6 text-[#4F46E5] dark:text-indigo-400" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#14B8A6] dark:bg-emerald-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#F59E0B] dark:bg-amber-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-[#4F46E5] dark:bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          </div>
          
          <Link 
            href="/chat"
            className="w-full inline-flex items-center justify-center px-4 py-3 bg-[#4F46E5] dark:bg-indigo-600 text-white rounded-md hover:bg-[#4338CA] dark:hover:bg-indigo-500 transition-colors font-medium text-sm"
          >
            Start new conversation
          </Link>
        </div>

      </div>
    </div>
  );
}
