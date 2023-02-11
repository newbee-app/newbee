import { randomBytes } from 'crypto';
import slug from 'slug';

/**
 * Generates a string saying the given `column` IS NOT NULL.
 * For use in interacting with the database.
 *
 * @param column The name of the column in question.
 * @returns A string saying the given `column` IS NOT NULL.
 */
export function isNotNull(column: string): string {
  return `${column} IS NOT NULL`;
}

/**
 * Generates a unique slug for a given string, using the provided `isUnique` callback to check that the slug is unique.
 * The function first tries to turn the string into a slug.
 * If the string as a slug is already taken, it adds a dash (`-`) and 6 random characters to slugified string, until a unique slug is found.
 *
 * @param isUnique The callback to check whether a slug is unique.
 * @param str The string to turn into a slug.
 *
 * @returns The name turned into a unique slug.
 */
export async function generateUniqueSlug(
  isUnique: (slugToTry: string) => Promise<boolean>,
  str: string
): Promise<string> {
  const nameAsSlug = slug(str);
  let slugToTry = nameAsSlug;
  while (!(await isUnique(slugToTry))) {
    slugToTry = `${nameAsSlug}-${randomBytes(3).toString('hex')}`;
  }
  return slugToTry;
}
