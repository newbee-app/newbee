/**
 * Takes in a value and optionally a previous value.
 * If the previous value exists, output an array.
 * If not, output the value.
 *
 * @param value The value to add to the array or return.
 * @param prev The previous value, if any.
 *
 * @returns The value or the value appended to the array, if a previous value exists.
 */
export function valueOrArray<T>(
  value: T,
  prev?: T | T[] | undefined | null,
): T | T[] {
  if (prev === undefined || prev === null) {
    return value;
  }

  if (Array.isArray(prev)) {
    prev.push(value);
    return prev;
  }

  return [prev, value];
}
