'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { getBrowserLocale } from '@/lib/locale';

interface RawData {
  timestamp: number; // Unix timestamp in milliseconds
}

export function RelapseHeatmap({ data, locale }: { data: RawData[]; locale: string }) {
  const t = useTranslations('Dashboard');
  
  // Process data in client timezone
  const heatmapData = useMemo(() => {
    // Group by date in user's timezone
    const dateMap = new Map<string, number>();
    
    data.forEach(item => {
      const date = new Date(item.timestamp);
      const dateStr = date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
      dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1);
    });

    // Create array for last 30 days
    const result = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-CA');
      result.push({
        date: dateStr,
        count: dateMap.get(dateStr) || 0
      });
    }

    return result;
  }, [data]);
  
  // Define the intensity classes based on count
  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-stone-100 dark:bg-gray-700';
    if (count <= 2) return 'bg-green-300 dark:bg-green-700';
    if (count <= 5) return 'bg-yellow-300 dark:bg-yellow-600';
    if (count <= 8) return 'bg-orange-400 dark:bg-orange-600';
    return 'bg-red-500 dark:bg-red-600';
  };

  // Group data by weeks (7 days per week)
  const weeks = useMemo(() => {
    const result = [];
    for (let i = 0; i < heatmapData.length; i += 7) {
      result.push(heatmapData.slice(i, i + 7));
    }
    return result;
  }, [heatmapData]);

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => {
              const date = new Date(day.date);
              const dayLabel = date.toLocaleDateString(getBrowserLocale(locale), { 
                month: 'short', 
                day: 'numeric' 
              });
              
              return (
                <div 
                  key={day.date} 
                  className={`w-8 h-8 rounded ${getIntensityClass(day.count)} transition-all hover:scale-110 cursor-pointer`}
                  title={`${dayLabel}: ${day.count} ${t('attempts')}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center gap-2 text-xs text-stone-600 dark:text-gray-400">
        <span>{t('noData')}</span>
        <div className="flex gap-1">
          {[0, 2, 5, 8, 10].map((val, idx) => (
            <div 
              key={idx}
              className={`w-4 h-4 rounded ${getIntensityClass(val)}`}
            />
          ))}
        </div>
        <span>{t('attempts')}</span>
      </div>
    </div>
  );
}