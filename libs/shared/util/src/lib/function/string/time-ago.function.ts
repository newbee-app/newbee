import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { SupportedLocale } from '../../enum';

TimeAgo.addLocale(en);

TimeAgo.setDefaultLocale('en');

const localeToTimeAgo = new Map<string, TimeAgo>();

/**
 * Takes in a locale string and returns a corresponding time ago instance.
 *
 * @param locale A string detailing a locale.
 *
 * @returns A TimeAgo instance for formatting dates to 'time ago' strings.
 */
export function createTimeAgo(locale: string): TimeAgo {
  if (!(Object.values(SupportedLocale) as string[]).includes(locale)) {
    locale = SupportedLocale.US;
  }

  if (localeToTimeAgo.has(locale)) {
    return localeToTimeAgo.get(locale) as TimeAgo;
  }

  const timeAgo = new TimeAgo(locale);
  localeToTimeAgo.set(locale, timeAgo);
  return timeAgo;
}
