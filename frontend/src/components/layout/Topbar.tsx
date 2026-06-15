import { Menu, Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const Topbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <header className="h-16 bg-[#FFFFFF] dark:bg-gray-900 border-b border-[#E5E7EB] dark:border-slate-700 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0 shrink-0 transition-colors duration-200">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 mr-2 text-[#6B7280] dark:text-slate-400 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 rounded-md md:hidden transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center space-x-2">
        {mounted && (
          <div className="flex bg-gray-100 dark:bg-slate-800 rounded-lg p-1 border border-gray-200 dark:border-slate-700">
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-md transition-colors ${theme === 'light' ? 'bg-white dark:bg-slate-700 text-[#4F46E5] dark:text-indigo-400 shadow-sm' : 'text-[#6B7280] dark:text-slate-400 hover:text-[#111827] dark:hover:text-slate-200'}`}
              title="Light Mode"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`p-1.5 rounded-md transition-colors ${theme === 'system' ? 'bg-white dark:bg-slate-700 text-[#4F46E5] dark:text-indigo-400 shadow-sm' : 'text-[#6B7280] dark:text-slate-400 hover:text-[#111827] dark:hover:text-slate-200'}`}
              title="System Theme"
            >
              <Laptop className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'bg-white dark:bg-slate-700 text-[#4F46E5] dark:text-indigo-400 shadow-sm' : 'text-[#6B7280] dark:text-slate-400 hover:text-[#111827] dark:hover:text-slate-200'}`}
              title="Dark Mode"
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
