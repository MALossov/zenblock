import { getTranslations } from 'next-intl/server';
import { ZenQuote } from '@/components/ZenQuote';
import { DailyRelapseChart } from '@/components/charts/DailyRelapseChart';
import { RelapseHeatmap } from '@/components/charts/RelapseHeatmap';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { DashboardClient } from './DashboardClient';

type SearchParams = Promise<{ source?: string }>;

export default async function DashboardPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  const { source } = await searchParams;
  
  const t = await getTranslations({ locale, namespace: 'Dashboard' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });

  // Get all unique sources
  const allSources = await prisma.relapseLog.findMany({
    select: { source: true },
    distinct: ['source'],
    orderBy: { source: 'asc' }
  });
  const sources = allSources.map(s => s.source);

  // Build where clause based on source filter
  const whereClause = source ? { source } : {};

  // Get today's attempts
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayAttempts = await prisma.relapseLog.count({
    where: {
      ...whereClause,
      timestamp: {
        gte: today,
      }
    }
  });

  // Get total attempts
  const totalAttempts = await prisma.relapseLog.count({
    where: whereClause
  });

  // Get last attempt
  const lastAttempt = await prisma.relapseLog.findFirst({
    where: whereClause,
    orderBy: {
      timestamp: 'desc'
    }
  });

  // Get hourly data for the chart
  const hourlyData = await getHourlyData(source);

  // Get heatmap data (last 30 days)
  const heatmapData = await getHeatmapData(source);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-stone-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-stone-800 dark:text-gray-100">{t('title')}</h1>
              <p className="mt-1 text-stone-600 dark:text-gray-300">{t('subtitle')}</p>
            </div>
            <Link
              href={`/${locale}`}
              className="px-4 py-2 bg-stone-800 dark:bg-stone-700 text-white rounded-lg hover:bg-stone-700 dark:hover:bg-stone-600 transition-colors"
            >
              {tCommon('home')}
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Source Filter */}
        <DashboardClient locale={locale} sources={sources} initialSource={source} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Today's Attempts */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-stone-200 dark:border-gray-700">
            <div className="text-stone-500 dark:text-gray-400 text-sm font-medium mb-2">
              {t('todayAttempts')}
            </div>
            <div className="text-4xl font-bold text-red-600 dark:text-red-500">{todayAttempts}</div>
          </div>

          {/* Total Attempts */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-stone-200 dark:border-gray-700">
            <div className="text-stone-500 dark:text-gray-400 text-sm font-medium mb-2">
              {t('totalAttempts')}
            </div>
            <div className="text-4xl font-bold text-stone-800 dark:text-gray-100">{totalAttempts}</div>
          </div>

          {/* Last Attempt */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-stone-200 dark:border-gray-700">
            <div className="text-stone-500 dark:text-gray-400 text-sm font-medium mb-2">
              {t('lastAttempt')}
            </div>
            <div className="text-2xl font-bold text-stone-800 dark:text-gray-100">
              {lastAttempt 
                ? new Date(lastAttempt.timestamp).toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : t('noData')}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Hourly Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-stone-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-stone-800 dark:text-gray-100 mb-6">{t('chartTitle')}</h2>
            <DailyRelapseChart data={hourlyData} locale={locale} />
          </div>

          {/* Heatmap */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-stone-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-stone-800 dark:text-gray-100 mb-6">{t('heatmapTitle')}</h2>
            <RelapseHeatmap data={heatmapData} locale={locale} />
          </div>
        </div>

        {/* Zen Quote */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-stone-200 dark:border-gray-700">
          <ZenQuote />
        </div>
      </div>
    </div>
  );
}

async function getHourlyData(source?: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const whereClause = source ? { source } : {};
  
  const logs = await prisma.relapseLog.findMany({
    where: {
      ...whereClause,
      timestamp: {
        gte: today
      }
    },
    select: {
      timestamp: true
    }
  });

  // Group by hour
  const hourlyMap = new Map<number, number>();
  for (let i = 0; i < 24; i++) {
    hourlyMap.set(i, 0);
  }

  logs.forEach(log => {
    const hour = new Date(log.timestamp).getHours();
    hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
  });

  return Array.from(hourlyMap.entries()).map(([hour, count]) => ({
    hour,
    count
  }));
}

async function getHeatmapData(source?: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const whereClause = source ? { source } : {};

  const logs = await prisma.relapseLog.findMany({
    where: {
      ...whereClause,
      timestamp: {
        gte: thirtyDaysAgo
      }
    },
    select: {
      timestamp: true
    }
  });

  // Group by date
  const dateMap = new Map<string, number>();
  
  logs.forEach(log => {
    const date = new Date(log.timestamp);
    const dateStr = date.toISOString().split('T')[0];
    dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1);
  });

  // Create array for last 30 days
  const heatmapData = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    heatmapData.push({
      date: dateStr,
      count: dateMap.get(dateStr) || 0
    });
  }

  return heatmapData;
}