'use client';

import { useEffect, useState } from 'react';
import { getOrCreateStats, calculateCurrentStreak } from '@/actions/achievements';
import { TrendingUp, Calendar, Target, BarChart3 } from 'lucide-react';

interface StatsCardsProps {
  source: string;
  locale: string;
}

interface Stats {
  currentStreak: number;
  longestStreak: number;
  totalRelapses: number;
  lastRelapseDate: Date | null;
}

export function StatsCards({ source, locale }: StatsCardsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [dbStats, currentStreak] = await Promise.all([
          getOrCreateStats(source),
          calculateCurrentStreak(source)
        ]);
        
        setStats({
          currentStreak,
          longestStreak: dbStats.longestStreak,
          totalRelapses: dbStats.totalRelapses,
          lastRelapseDate: dbStats.lastRelapseDate
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [source]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const getTranslation = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      currentStreak: { zh: '当前连续', en: 'Current Streak', ja: '現在の連続' },
      longestStreak: { zh: '最长连续', en: 'Longest Streak', ja: '最長連続' },
      totalRelapses: { zh: '总破戒次数', en: 'Total Relapses', ja: '総回数' },
      lastRelapse: { zh: '上次破戒', en: 'Last Relapse', ja: '前回' },
      days: { zh: '天', en: 'days', ja: '日' },
      times: { zh: '次', en: 'times', ja: '回' },
      never: { zh: '从未', en: 'Never', ja: 'なし' },
    };
    return translations[key]?.[locale] || translations[key]?.['zh'] || key;
  };

  const formatLastRelapse = () => {
    if (!stats.lastRelapseDate) return getTranslation('never');
    const date = new Date(stats.lastRelapseDate);
    return date.toLocaleDateString(locale);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <Calendar className="w-8 h-8 opacity-80" />
          <div className="text-xs opacity-80">{getTranslation('currentStreak')}</div>
        </div>
        <div className="text-3xl font-bold">{stats.currentStreak}</div>
        <div className="text-sm opacity-80 mt-1">{getTranslation('days')}</div>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <TrendingUp className="w-8 h-8 opacity-80" />
          <div className="text-xs opacity-80">{getTranslation('longestStreak')}</div>
        </div>
        <div className="text-3xl font-bold">{stats.longestStreak}</div>
        <div className="text-sm opacity-80 mt-1">{getTranslation('days')}</div>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <BarChart3 className="w-8 h-8 opacity-80" />
          <div className="text-xs opacity-80">{getTranslation('totalRelapses')}</div>
        </div>
        <div className="text-3xl font-bold">{stats.totalRelapses}</div>
        <div className="text-sm opacity-80 mt-1">{getTranslation('times')}</div>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <Target className="w-8 h-8 opacity-80" />
          <div className="text-xs opacity-80">{getTranslation('lastRelapse')}</div>
        </div>
        <div className="text-lg font-bold">{formatLastRelapse()}</div>
      </div>
    </div>
  );
}
