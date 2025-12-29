import { logRelapse } from '@/actions/log-relapse';
import { getTranslations } from 'next-intl/server';
import { ZenQuote } from '@/components/ZenQuote';
import { headers } from 'next/headers';
import Link from 'next/link';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black dark:from-black dark:to-gray-900 text-white flex flex-col items-center justify-center p-4">
      {/* Header Controls */}
      <div className="fixed top-4 right-4 flex gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>

      <div className="max-w-lg w-full bg-gray-800 dark:bg-gray-900 rounded-xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{t('headline')}</h1>
          <p className="text-xl text-gray-300">{t('subheadline')}</p>
        </div>

        <div className="text-center mt-8">
          <p className="text-2xl">
            {t('stats_prefix')} <span className="font-bold text-3xl text-yellow-400">{relapseCount}</span> {t('stats_suffix')}
          </p>
        </div>

        <div className="mt-10">
          <ZenQuote />
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>{t('quote_source')}</p>
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            href={`/${locale}`}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            {t('backToConsole')}
          </Link>
          <Link
            href={`/${locale}/dashboard`}
            className="flex-1 px-4 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-600 transition-colors text-center"
          >
            {locale === 'zh' ? '查看仪表盘' : 'View Dashboard'}
          </Link>
        </div>
      </div>
    </div>
  );
}