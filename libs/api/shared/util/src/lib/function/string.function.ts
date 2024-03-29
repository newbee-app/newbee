import { randomBytes } from 'crypto';
import short from 'short-uuid';
import slug from 'slug';

/**
 * An instance of `short-uuid` to work with.
 */
export const translator = short();

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
 * The message to send to the logger when a user challenge is `null`, even though we expect it to have a truthy value.
 */
export function challengeFalsy(
  operation: 'login' | 'registration',
  challenge: string | undefined | null,
  userId: string,
): string {
  return `Attempted to verify a ${operation} response even though user's challenge string is ${challenge} for user: ${userId}`;
}

/**
 * Generates a unique slug for a given string, using the provided `isUnique` callback to check that the slug is unique.
 * The function first tries to turn the string into a slug.
 * If the string as a slug is already taken, it adds a dash (`-`) and 6 random characters to the slugified string, until a unique slug is created.
 *
 * @param isUnique The callback to check whether a slug is unique.
 * @param str The string to turn into a slug.
 *
 * @returns The name turned into a unique slug.
 */
export async function generateUniqueSlug(
  isUnique: (slugToTry: string) => Promise<boolean>,
  str: string,
): Promise<string> {
  const strAsSlug = slug(str);
  let slugToTry = strAsSlug;
  while (!(await isUnique(slugToTry))) {
    slugToTry = `${strAsSlug}-${randomBytes(3).toString('hex')}`;
  }
  return slugToTry;
}

/**
 * Shortens the given UUID.
 *
 * @param uuid The UUID to shorten.
 *
 * @returns A shortened version of the UUID.
 */
export function shortenUuid(uuid: string): string {
  return translator.fromUUID(uuid);
}

/**
 * Elongates the shortened UUID back to the original UUID v4 format.
 *
 * @param shortUuid The shortened UUID.
 *
 * @returns The original-length UUID.
 */
export function elongateUuid(shortUuid: string): string {
  return translator.toUUID(shortUuid);
}
