'use client';

import { useEffect, useState } from 'react';
import { getAchievements, calculateCurrentStreak, type AchievementData } from '@/actions/achievements';
import { Trophy, Lock } from 'lucide-react';

interface AchievementBadgeProps {
  source: string;
  locale: string;
}

export function AchievementBadge({ source, locale }: AchievementBadgeProps) {
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAchievements() {
      try {
        const [achievementsList, streak] = await Promise.all([
          getAchievements(source, locale),
          calculateCurrentStreak(source)
        ]);
        setAchievements(achievementsList);
        setCurrentStreak(streak);
      } catch (error) {
        console.error('Error loading achievements:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAchievements();
  }, [source, locale]);

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded-lg"></div>
    );
  }

  const earnedCount = achievements.filter(a => a.earned).length;
  const totalCount = achievements.length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          {locale === 'zh' ? '成就' : locale === 'ja' ? '実績' : 'Achievements'}
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {earnedCount} / {totalCount}
        </div>
      </div>

      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          {locale === 'zh' ? '当前连续' : locale === 'ja' ? '現在の連続' : 'Current Streak'}
        </div>
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {currentStreak} {locale === 'zh' ? '天' : locale === 'ja' ? '日' : 'days'}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.name}
            className={`relative p-3 rounded-lg border-2 transition-all ${
              achievement.earned
                ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 opacity-60'
            }`}
            title={achievement.description}
          >
            <div className="text-center">
              <div className="text-4xl mb-2 relative">
                {achievement.icon}
                {!achievement.earned && (
                  <Lock className="absolute inset-0 m-auto w-6 h-6 text-gray-500" />
                )}
              </div>
              <div className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                {achievement.title}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {achievement.daysRequired} {locale === 'zh' ? '天' : locale === 'ja' ? '日' : 'd'}
              </div>
              {achievement.earned && achievement.earnedAt && (
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                  ✓ {new Date(achievement.earnedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
