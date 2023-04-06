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
  substr: string,
  leftSurround: string,
  rightSurround: string,
  ignoreCase = true
): string {
  const regex = new RegExp(substr, ignoreCase ? 'gi' : 'g');
  return str.replace(regex, (match) => {
    return `${leftSurround}${match}${rightSurround}`;
  });
}

/**
 * Takes in a string, looks for all instances of the substrings within the string, then surrounds those instances on the left and right with the given inputs.
 * If there are duplicates in substrings, the surround will be repeated.
 *
 * @param str The main string to look in.
 * @param substrings The substring patterns to look for.
 * @param leftSurround The left side of the surround.
 * @param rightSurround The right side of the surround.
 * @param ignoreCase Whether to ingore casing when looking for the substrings in the main string.
 *
 * @returns The string with all instances of the substrings surrounded with the given inputs.
 */
export function surroundSubstringsWith(
  str: string,
  substrings: string[],
  leftSurround: string,
  rightSurround: string,
  ignoreCase = true
): string {
  substrings.forEach((substr) => {
    str = surroundSubstringWith(
      str,
      substr,
      leftSurround,
      rightSurround,
      ignoreCase
    );
  });
  return str;
}
