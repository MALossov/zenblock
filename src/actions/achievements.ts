'use server';

import { prisma } from '@/lib/db';
import { getTranslations } from 'next-intl/server';

export interface AchievementData {
  name: string;
  title: string;
  description: string;
  icon: string;
  daysRequired: number;
  earned: boolean;
  earnedAt?: Date;
}

// 定义所有可能的成就
const ACHIEVEMENTS_CONFIG = [
  { name: 'first_day', daysRequired: 1, icon: '🌱' },
  { name: 'three_days', daysRequired: 3, icon: '🌿' },
  { name: 'week_warrior', daysRequired: 7, icon: '⭐' },
  { name: 'two_weeks', daysRequired: 14, icon: '🏆' },
  { name: 'month_champion', daysRequired: 30, icon: '👑' },
  { name: 'quarter_master', daysRequired: 90, icon: '💎' },
  { name: 'half_year_hero', daysRequired: 180, icon: '🎖️' },
  { name: 'year_legend', daysRequired: 365, icon: '🏅' },
];

export async function getAchievements(source: string, locale: string = 'zh'): Promise<AchievementData[]> {
  try {
    const t = await getTranslations({ locale, namespace: 'Achievements' });
    
    // 获取当前连续天数
    const stats = await getOrCreateStats(source);
    const currentStreak = stats.currentStreak;

    // 获取已获得的成就
    const earnedAchievements = await prisma.achievement.findMany({
      where: { source },
      orderBy: { earnedAt: 'desc' }
    });

    // 构建成就列表
    const achievements: AchievementData[] = ACHIEVEMENTS_CONFIG.map(config => {
      const earned = earnedAchievements.find(a => a.name === config.name);
      return {
        name: config.name,
        title: t(`${config.name}.title`),
        description: t(`${config.name}.description`),
        icon: config.icon,
        daysRequired: config.daysRequired,
        earned: !!earned,
        earnedAt: earned?.earnedAt
      };
    });

    return achievements;
  } catch (error) {
    console.error('Error getting achievements:', error);
    return [];
  }
}

export async function checkAndAwardAchievements(source: string): Promise<string[]> {
  try {
    const stats = await getOrCreateStats(source);
    const currentStreak = stats.currentStreak;
    const newAchievements: string[] = [];

    // 检查每个成就
    for (const config of ACHIEVEMENTS_CONFIG) {
      if (currentStreak >= config.daysRequired) {
        // 检查是否已经获得
        const existing = await prisma.achievement.findFirst({
          where: {
            source,
            name: config.name
          }
        });

        if (!existing) {
          // 授予新成就
          await prisma.achievement.create({
            data: {
              name: config.name,
              source,
              daysClean: currentStreak
            }
          });
          newAchievements.push(config.name);
        }
      }
    }

    return newAchievements;
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
}

export async function getOrCreateStats(source: string) {
  let stats = await prisma.userStats.findUnique({
    where: { source }
  });

  if (!stats) {
    stats = await prisma.userStats.create({
      data: {
        source,
        currentStreak: 0,
        longestStreak: 0,
        totalRelapses: 0
      }
    });
  }

  return stats;
}

export async function updateStreakStats(source: string) {
  try {
    const stats = await getOrCreateStats(source);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // 如果今天破戒了，更新统计
    const lastRelapse = stats.lastRelapseDate ? new Date(stats.lastRelapseDate) : null;
    
    if (!lastRelapse || lastRelapse < now) {
      // 这是今天的第一次破戒，连续天数归零
      await prisma.userStats.update({
        where: { source },
        data: {
          lastRelapseDate: new Date(),
          currentStreak: 0,
          totalRelapses: stats.totalRelapses + 1
        }
      });
    } else {
      // 今天已经破戒过了，只增加计数
      await prisma.userStats.update({
        where: { source },
        data: {
          totalRelapses: stats.totalRelapses + 1
        }
      });
    }

    return true;
  } catch (error) {
    console.error('Error updating streak stats:', error);
    return false;
  }
}

export async function calculateCurrentStreak(source: string): Promise<number> {
  try {
    const stats = await getOrCreateStats(source);
    
    if (!stats.lastRelapseDate) {
      // 从未破戒，计算从第一条记录到现在的天数
      const firstLog = await prisma.relapseLog.findFirst({
        where: { source },
        orderBy: { timestamp: 'asc' }
      });
      
      if (!firstLog) return 0;
      
      const daysSince = Math.floor((Date.now() - firstLog.timestamp.getTime()) / (1000 * 60 * 60 * 24));
      return daysSince;
    }

    const lastRelapse = new Date(stats.lastRelapseDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastRelapse.setHours(0, 0, 0, 0);

    const daysSinceRelapse = Math.floor((today.getTime() - lastRelapse.getTime()) / (1000 * 60 * 60 * 24));
    
    // 更新当前连续天数
    const newStreak = daysSinceRelapse;
    if (newStreak > stats.currentStreak) {
      await prisma.userStats.update({
        where: { source },
        data: {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, stats.longestStreak)
        }
      });
    }

    return newStreak;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
}
