import { logRelapse } from '@/actions/log-relapse';
import { getTranslations } from 'next-intl/server';
import { ZenQuote } from '@/components/ZenQuote';
import { headers } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default async function InterceptPage({
  searchParams,
  params
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const source = resolvedSearchParams.source as string || 'unknown';
  const t = await getTranslations({ locale, namespace: 'Intercept' });

  // Log the relapse and get the count
  const result = await logRelapse(source, locale);
  const relapseCount = result.count;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-black text-gray-900 dark:text-white flex flex-col items-center justify-center p-4">
      {/* Header Controls */}
      <div className="fixed top-4 right-4 flex gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>

      <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 space-y-6 border-2 border-red-200 dark:border-red-900">
        <div className="text-center">
          {/* App Icon */}
          <div className="flex justify-center mb-4">
            <Image src="/favicon.svg" alt="ZenBlock" width={80} height={80} unoptimized />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-red-600 dark:text-red-400">{t('headline')}</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">{t('subheadline')}</p>
        </div>

        <div className="text-center mt-8">
          <p className="text-2xl text-gray-800 dark:text-gray-200">
            {t('stats_prefix')} <span className="font-bold text-3xl text-yellow-600 dark:text-yellow-400">{relapseCount}</span> {t('stats_suffix')}
          </p>
        </div>

        <div className="mt-10">
          <ZenQuote />
        </div>

        <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>{t('quote_source')}</p>
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            href={`/${locale}`}
            className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-center"
          >
            {t('backToConsole')}
          </Link>
          <Link
            href={`/${locale}/dashboard`}
            className="flex-1 px-4 py-2 bg-stone-700 dark:bg-stone-600 text-white rounded-lg hover:bg-stone-600 dark:hover:bg-stone-500 transition-colors text-center"
          >
            {locale === 'zh' ? '查看仪表盘' : 'View Dashboard'}
          </Link>
        </div>
      </div>
    </div>
  );
}