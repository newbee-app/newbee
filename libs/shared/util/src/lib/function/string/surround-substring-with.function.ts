/**
 * Takes in a string, looks for all instances of a substring within the string, then surrounds those instances on the left and right with the given inputs.
 *
 * @param str The main string to look in.
 * @param substr The substring pattern to look for.
 * @param leftSurround The left side of the surround.
 * @param rightSurround The right side of the surround.
 * @param ignoreCase Whether to ignore casing when looking for the substring in the main string.
 *
 * @returns The string with all instances of the substring surrounded with the given inputs.
 */
export function surroundSubstringWith(
  str: string,
  substr: string | RegExp,
  leftSurround: string,
  rightSurround: string,
  ignoreCase = true,
): string {
  const regex =
    typeof substr === 'string'
      ? new RegExp(substr, ignoreCase ? 'gi' : 'g')
      : substr;
  return str.replace(regex, (match) => {
    return `${leftSurround}${match}${rightSurround}`;
  });
}
