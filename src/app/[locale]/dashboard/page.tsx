import { getTranslations } from 'next-intl/server';
import { ZenQuote } from '@/components/ZenQuote';
import { DailyRelapseChart } from '@/components/charts/DailyRelapseChart';
import { RelapseHeatmap } from '@/components/charts/RelapseHeatmap';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { DashboardClient, LastAttemptTime } from './DashboardClient';
import { getBrowserLocale } from '@/lib/locale';

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
            <div className="flex items-center gap-4">
              <Image src="/favicon.svg" alt="ZenBlock" width={48} height={48} unoptimized />
              <div>
                <h1 className="text-3xl font-bold text-stone-800 dark:text-gray-100">{t('title')}</h1>
                <p className="mt-1 text-stone-600 dark:text-gray-300">{t('subtitle')}</p>
              </div>
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
              <LastAttemptTime 
                timestamp={lastAttempt?.timestamp.getTime()}
                locale={locale}
                noDataText={t('noData')}
              />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Hourly Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-stone-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-stone-800 dark:text-gray-100 mb-6">{t('chartTitle')}</h2>
            <div className="w-full" style={{ minHeight: '320px' }}>
              <DailyRelapseChart data={hourlyData} locale={locale} />
            </div>
          </div>

          {/* Heatmap */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-stone-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-stone-800 dark:text-gray-100 mb-6">{t('heatmapTitle')}</h2>
            <div className="w-full" style={{ minHeight: '320px' }}>
              <RelapseHeatmap data={heatmapData} locale={locale} />
            </div>
          </div>
        </div>

        {/* Zen Quote */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-stone-200 dark:border-gray-700 min-h-[160px]">
          <ZenQuote />
        </div>
      </div>
    </div>
  );
}

async function getHourlyData(source?: string) {
  const whereClause = source ? { source } : {};
  
  // Get all logs (let client-side handle timezone conversion)
  const logs = await prisma.relapseLog.findMany({
    where: whereClause,
    select: {
      timestamp: true
    },
    orderBy: {
      timestamp: 'desc'
    }
  });

  // Return raw timestamps, client will group by hour in user's timezone
  return logs.map(log => ({
    timestamp: log.timestamp.getTime() // Unix timestamp in milliseconds
  }));
}

async function getHeatmapData(source?: string) {
  const whereClause = source ? { source } : {};

  // Get logs from last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

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

  // Return raw timestamps, client will group by date in user's timezone
  return logs.map(log => ({
    timestamp: log.timestamp.getTime() // Unix timestamp in milliseconds
  }));
}