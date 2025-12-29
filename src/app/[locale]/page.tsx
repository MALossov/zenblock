import { generateScript } from '@/actions/generate-script';
import { getTranslations } from 'next-intl/server';
import ScriptGenerator from './ScriptGenerator';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Landing' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });

  // Convert translations to plain object for client component
  const translations = {
    placeholder: t('placeholder'),
    generate: t('generate'),
    generating: t('generating'),
    scriptTitle: t('scriptTitle'),
    scriptDesc: t('scriptDesc'),
    copyToClipboard: t('copyToClipboard'),
    viewDashboard: t('viewDashboard'),
    installScript: t('installScript')
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      {/* Header Controls */}
      <div className="fixed top-4 right-4 flex gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>

      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{t('subtitle')}</p>
        </div>

        <ScriptGenerator translations={translations} locale={locale} />
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link 
            href={`/${locale}/dashboard`}
            className="block w-full text-center px-4 py-2 bg-stone-800 dark:bg-stone-700 text-white rounded-lg hover:bg-stone-700 dark:hover:bg-stone-600 transition-colors"
          >
            {translations.viewDashboard}
          </Link>
        </div>
      </div>
    </div>
  );
}