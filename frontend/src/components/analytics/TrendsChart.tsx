import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';

export default function TrendsChart({ trends }: { trends: Record<string, unknown>[] }) {
  const { theme, systemTheme } = useTheme();
  const isDark = (theme === 'system' ? systemTheme : theme) === 'dark';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={trends}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#E5E7EB'} vertical={false} />
        <XAxis dataKey="date" stroke={isDark ? '#94A3B8' : '#6B7280'} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke={isDark ? '#94A3B8' : '#6B7280'} fontSize={12} tickLine={false} axisLine={false} />
        <RechartsTooltip 
          contentStyle={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E5E7EB', color: isDark ? '#F8FAFC' : '#111827', borderRadius: '8px' }}
          itemStyle={{ color: '#4F46E5' }}
        />
        <Line type="monotone" dataKey="queries" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
