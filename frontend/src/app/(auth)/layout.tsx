"use client";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto h-12 w-12 bg-indigo-50 dark:bg-indigo-500/10 text-[#4F46E5] dark:text-indigo-400 flex items-center justify-center rounded-xl mb-4 transition-colors">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111827] dark:text-slate-50 transition-colors">
          Campus AI
        </h2>
        <p className="mt-2 text-sm text-[#6B7280] dark:text-slate-400 transition-colors">
          Your intelligent assistant for campus life.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#FFFFFF] dark:bg-slate-800 py-8 px-4 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] dark:shadow-none border border-[#E5E7EB] dark:border-slate-700 sm:rounded-2xl sm:px-10 transition-colors duration-200">
          {children}
        </div>
      </div>
    </div>
  );
}
