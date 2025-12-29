import { routing } from './routing';

export const getPath = (locale: string, href: string) => {
  // If the locale is the default one, don't add it to the pathname
  if (locale === routing.defaultLocale) {
    return href;
  }

  // Otherwise, prepend the locale to the pathname
  return `/${locale}${href}`;
};