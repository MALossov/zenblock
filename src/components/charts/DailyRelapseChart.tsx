'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface ChartData {
  hour: number;
  count: number;
}

export function DailyRelapseChart({ data, locale }: { data: ChartData[]; locale: string }) {
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
  
  // Transform data to include formatted labels
  const chartData = data.map(item => ({
    hour: item.hour + t('hour'),
    count: item.count
  }));

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