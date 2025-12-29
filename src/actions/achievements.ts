'use server';

import { prisma } from '@/lib/db';

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
        title: getAchievementTitle(config.name, locale),
        description: getAchievementDescription(config.name, locale, config.daysRequired),
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

function getAchievementTitle(name: string, locale: string): string {
  const titles: Record<string, Record<string, string>> = {
    first_day: { zh: '第一天', en: 'First Day', ja: '初日' },
    three_days: { zh: '三日之约', en: 'Three Days', ja: '三日間' },
    week_warrior: { zh: '一周勇士', en: 'Week Warrior', ja: '一週間の戦士' },
    two_weeks: { zh: '两周冠军', en: 'Two Weeks', ja: '二週間チャンピオン' },
    month_champion: { zh: '月度冠军', en: 'Month Champion', ja: '月間チャンピオン' },
    quarter_master: { zh: '季度大师', en: 'Quarter Master', ja: '四半期マスター' },
    half_year_hero: { zh: '半年英雄', en: 'Half Year Hero', ja: '半年ヒーロー' },
    year_legend: { zh: '年度传奇', en: 'Year Legend', ja: '年間レジェンド' },
  };
  return titles[name]?.[locale] || titles[name]?.['zh'] || name;
}

function getAchievementDescription(name: string, locale: string, days: number): string {
  const descriptions: Record<string, Record<string, string>> = {
    first_day: { 
      zh: '成功坚持一天不破戒', 
      en: 'Stay clean for 1 day', 
      ja: '1日間クリーンを保つ' 
    },
    three_days: { 
      zh: '连续三天保持自律', 
      en: 'Stay disciplined for 3 days', 
      ja: '3日間自制を保つ' 
    },
    week_warrior: { 
      zh: '完成一周的自我控制挑战', 
      en: 'Complete a week of self-control', 
      ja: '一週間の自制チャレンジを完了' 
    },
    two_weeks: { 
      zh: '两周的坚持让你更强大', 
      en: 'Two weeks of persistence makes you stronger', 
      ja: '二週間の継続があなたを強くする' 
    },
    month_champion: { 
      zh: '一个月的努力值得骄傲', 
      en: 'A month of effort to be proud of', 
      ja: '一ヶ月の努力を誇りに思う' 
    },
    quarter_master: { 
      zh: '三个月的蜕变之旅', 
      en: 'Three months of transformation', 
      ja: '三ヶ月の変容の旅' 
    },
    half_year_hero: { 
      zh: '半年的坚守铸就英雄', 
      en: 'Half a year of dedication forges a hero', 
      ja: '半年間の献身がヒーローを作る' 
    },
    year_legend: { 
      zh: '一整年的自律成就传奇', 
      en: 'A full year of discipline creates a legend', 
      ja: '一年間の規律が伝説を生む' 
    },
  };
  return descriptions[name]?.[locale] || descriptions[name]?.['zh'] || `${days} days clean`;
}
