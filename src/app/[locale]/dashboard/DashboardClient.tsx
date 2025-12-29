'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslations } from 'next-intl';

interface DashboardClientProps {
  locale: string;
  sources: string[];
  initialSource?: string;
}

export function DashboardClient({ locale, sources, initialSource }: DashboardClientProps) {
  const t = useTranslations('Dashboard');
  const [selectedSource, setSelectedSource] = useState(initialSource || 'all');

  const handleSourceChange = (source: string) => {
    setSelectedSource(source);
    const params = new URLSearchParams(window.location.search);
    if (source === 'all') {
      params.delete('source');
    } else {
      params.set('source', source);
    }
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.pushState({}, '', newUrl);
    window.location.reload();
  };

  return (
    <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleSourceChange('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedSource === 'all'
              ? 'bg-stone-800 dark:bg-stone-700 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {t('allSites')}
        </button>
        {sources.map((source) => (
          <button
            key={source}
            onClick={() => handleSourceChange(source)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedSource === source
                ? 'bg-stone-800 dark:bg-stone-700 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {source}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
    </div>
  );
}
