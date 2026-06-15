import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';

const COLORS = ['#4F46E5', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function ServiceDistChart({ serviceDist }: { serviceDist: any[] }) {
  const { theme, systemTheme } = useTheme();
  const isDark = (theme === 'system' ? systemTheme : theme) === 'dark';

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={serviceDist}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {serviceDist.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <RechartsTooltip 
            contentStyle={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E5E7EB', color: isDark ? '#F8FAFC' : '#111827', borderRadius: '8px' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-3 mt-2 absolute bottom-0 left-0 w-full p-2">
        {serviceDist.map((entry: any, index: number) => (
          <div key={entry.name} className="flex items-center text-xs text-[#6B7280] dark:text-slate-400">
            <div className="w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
            {entry.name}
          </div>
        ))}
      </div>
    </>
  );
}
