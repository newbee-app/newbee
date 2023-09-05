/**
 * Takes in a string and strip it of any HTML tags.
 *
 * @param toStrip The string to strip.
 * @returns The string with HTML tags stripped.
 */
export function stripHtmlTags(toStrip: string): string {
  return toStrip.replace(/<[^>]*>/g, '');
}
