/**
 * A simple utility function that either creates a new array or pushes a new value to an existing array.
 *
 * @param value The value to add to an array.
 * @param prev The previous value.
 *
 * @returns The array containing the given and previous values.
 */
export function createArrayOrPush<T>(
  value: T,
  prev?: T | T[] | null | undefined,
): T[] {
  if (Array.isArray(prev)) {
    prev.push(value);
    return prev;
  } else if (prev === null || prev === undefined) {
    return [value];
  }

  return [prev, value];
}
