/**
 * Upper cases just the first letter of the given `str`.
 * @param str The string to alter.
 * @returns The string, with the first letter upper cased.
 */
export function upperCaseFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
