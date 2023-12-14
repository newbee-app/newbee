/**
 * A method to add an element to an existing array if it's unique.
 *
 * @param arr The array to add to.
 * @param toAdd The element to add.
 * @param last If the element is added, whether to place the item towards the front or the back of the array. Defaults to `true`.
 * @param isEqual A function that should be used to determine whether two values are equal. Uses a straight equality check (`===`) by default.
 *
 * @returns The array with the element added, if it needed to be added.
 */
export function addToArrayIfUnique<T>(
  arr: T[],
  toAdd: T,
  last = true,
  isEqual = (a: T, b: T) => a === b,
): T[] {
  if (arr.some((item) => isEqual(item, toAdd))) {
    return arr;
  }

  return last ? [...arr, toAdd] : [toAdd, ...arr];
}
