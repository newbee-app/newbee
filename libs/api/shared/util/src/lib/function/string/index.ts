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
