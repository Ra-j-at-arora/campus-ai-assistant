import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquare, User, Star, BarChart3 } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '@/stores/authStore';

export const Sidebar = ({ isOpen, setOpen }: { isOpen: boolean, setOpen: (open: boolean) => void }) => {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'AI Chat', href: '/chat', icon: MessageSquare },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  if (user?.role === 'ADMIN') {
    links.splice(2, 0, { name: 'Analytics', href: '/admin', icon: BarChart3 });
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#FFFFFF] dark:bg-gray-900 border-r border-[#E5E7EB] dark:border-slate-700 transition-all duration-300 ease-in-out md:static md:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-[#E5E7EB] dark:border-slate-700 shrink-0">
          <h1 className="text-xl font-bold text-[#4F46E5] dark:text-indigo-500">Campus AI</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={clsx(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  isActive 
                    ? "bg-indigo-50 text-[#4F46E5] dark:bg-indigo-500/10 dark:text-indigo-400" 
                    : "text-[#6B7280] dark:text-slate-400 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 hover:text-[#111827] dark:hover:text-slate-50"
                )}
                onClick={() => setOpen(false)}
              >
                <link.icon className={clsx("w-5 h-5 mr-3 transition-colors", isActive ? "text-[#4F46E5] dark:text-indigo-400" : "text-[#6B7280] dark:text-slate-500")} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-[#E5E7EB] dark:border-slate-700 space-y-4 shrink-0">
          <button className="w-full flex items-center justify-center px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-[#4F46E5] dark:text-indigo-400 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors border border-transparent dark:border-indigo-500/20">
            <Star className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </button>
          
          <div className="flex items-center px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-slate-300 mr-3 shrink-0">
              {user?.name?.charAt(0) || 'N'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#111827] dark:text-slate-50 truncate">
                {user?.name || 'Nikhil Sharma'}
              </p>
              <p className="text-xs text-[#6B7280] dark:text-slate-400 truncate">
                {user?.email || 'nikhil@campus.edu'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
