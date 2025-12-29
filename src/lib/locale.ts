/**
 * Locale utilities for ZenBlock
 * Centralized locale mapping and formatting configuration
 */

/**
 * Maps our app locales to standard BCP 47 locale codes for browser APIs
 * Add new mappings here when supporting additional languages
 */
const LOCALE_MAP: Record<string, string> = {
  zh: 'zh-CN',
  en: 'en-US',
  ja: 'ja-JP',
  // ko: 'ko-KR',
  // fr: 'fr-FR',
};

/**
 * Converts app locale to standard browser locale code
 * @param locale - App locale code (e.g., 'zh', 'en')
 * @returns Standard BCP 47 locale code (e.g., 'zh-CN', 'en-US')
 */
export function getBrowserLocale(locale: string): string {
  return LOCALE_MAP[locale] || locale;
}
