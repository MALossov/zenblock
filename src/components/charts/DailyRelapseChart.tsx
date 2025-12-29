'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useMemo } from 'react';

interface RawData {
  timestamp: number; // Unix timestamp in milliseconds
}

export function DailyRelapseChart({ data, locale }: { data: RawData[]; locale: string }) {
  const t = useTranslations('Dashboard');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  
  // Process data in client timezone
  const chartData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    // Filter only today's data in user's timezone
    const todayLogs = data.filter(item => {
      const date = new Date(item.timestamp);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === todayTimestamp;
    });

    // Group by hour in user's timezone
    const hourlyMap = new Map<number, number>();
    for (let i = 0; i < 24; i++) {
      hourlyMap.set(i, 0);
    }

    todayLogs.forEach(item => {
      const date = new Date(item.timestamp);
      const hour = date.getHours();
      hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
    });

    return Array.from(hourlyMap.entries()).map(([hour, count]) => ({
      hour: hour + t('hour'),
      count
    }));
  }, [data, t]);

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 10,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
          <XAxis 
            dataKey="hour" 
            tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#6b7280' }}
            stroke={isDark ? '#6b7280' : '#6b7280'}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#6b7280' }}
            stroke={isDark ? '#6b7280' : '#6b7280'}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#fff',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              padding: '8px',
              color: isDark ? '#f3f4f6' : '#000'
            }}
          />
          <Bar 
            dataKey="count" 
            fill={isDark ? '#ef4444' : '#ef4444'}
            radius={[8, 8, 0, 0]}
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}