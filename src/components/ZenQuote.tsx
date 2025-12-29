'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

interface Quote {
  text: string;
  author: string;
}

export function ZenQuote() {
  const locale = useLocale();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadQuote() {
      try {
        // Dynamically import the messages based on locale
        const messages = await import(`@/../messages/${locale}.json`);
        const quotes = messages.ZenQuotes as Quote[];
        
        if (quotes && quotes.length > 0) {
          const randomIndex = Math.floor(Math.random() * quotes.length);
          setQuote(quotes[randomIndex]);
        }
      } catch (error) {
        console.error('Failed to load zen quotes:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadQuote();
  }, [locale]);

  if (isLoading) {
    return (
      <div className="bg-gray-700/50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-600 dark:border-gray-700 animate-pulse">
        <div className="h-6 bg-gray-600 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-600 dark:bg-gray-700 rounded w-1/3 ml-auto"></div>
      </div>
    );
  }

  if (!quote) {
    return null;
  }

  return (
    <div className="bg-gray-700/50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-600 dark:border-gray-700">
      <blockquote className="text-lg italic text-gray-200 dark:text-gray-300">
        "{quote.text}"
      </blockquote>
      <p className="mt-4 text-right text-gray-400 dark:text-gray-500">
        — {quote.author}
      </p>
    </div>
  );
}
