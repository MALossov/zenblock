import { generateScript } from '@/actions/generate-script';
import { getTranslations } from 'next-intl/server';
import ScriptGeneratorWrapper from './ScriptGeneratorWrapper';
import Link from 'next/link';
import Image from 'next/image';
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
    installScript: t('installScript'),
    copied: t('copied'),
    copyFailed: t('copyFailed')
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      {/* Header Controls */}
      <div className="fixed top-4 right-4 flex gap-2">
        <a
          href="https://github.com/MALossov/zenblock"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm border border-gray-200 dark:border-gray-700"
          title="GitHub"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
        </a>
        <ThemeToggle />
        <LanguageSwitcher />
      </div>

      <ScriptGeneratorWrapper translations={translations} locale={locale}>
        <div className="text-center">
          {/* App Icon/Logo */}
          <div className="flex justify-center mb-4">
            <Image src="/favicon.svg" alt="ZenBlock" width={64} height={64} priority unoptimized />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{t('subtitle')}</p>
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link 
            href={`/${locale}/dashboard`}
            className="block w-full text-center px-4 py-2 bg-stone-800 dark:bg-stone-700 text-white rounded-lg hover:bg-stone-700 dark:hover:bg-stone-600 transition-colors"
          >
            {translations.viewDashboard}
          </Link>
        </div>
      </ScriptGeneratorWrapper>
    </div>
  );
}