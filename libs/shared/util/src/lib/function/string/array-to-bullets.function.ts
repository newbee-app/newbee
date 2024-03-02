/**
 * Converts an array of strings into a single string divided by bullet points.
 * @param arr The array of strings to concatenate into a single string.
 * @returns A string of the array's contents divided by bullet points.
 */
export function arrayToBullets(arr: string[]): string {
  return arr.reduce(
    (prevValue, currValue, currIndex) =>
      `${prevValue}${currIndex ? '\n' : ''}- ${currValue}`,
    '',
  );
}
