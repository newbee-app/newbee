import { InvalidArgumentError } from 'commander';

/**
 * Convert the given string into an int or throw an exception if it can't be converted.
 *
 * @param str The string to convert.
 *
 * @returns The string as an int.
 * @throws {InvalidArgumentError} If the string is not a valid int.
 */
export function parseIntOrThrow(str: string): number {
  const parsedValue = parseInt(str, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError(`${str} is not a number.`);
  }

  return parsedValue;
}
