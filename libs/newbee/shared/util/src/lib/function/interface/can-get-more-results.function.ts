import { PaginatedResults } from '@newbee/shared/util';

/**
 * Whether it's possible to get more paginated results.
 *
 * @param paginatedResults The paginated results to check.
 *
 * @returns `true` if it's possible to get more pagianted results, `false` otherwise.
 */
export function canGetMoreResults<T>(
  paginatedResults: PaginatedResults<T> | null,
): boolean {
  return (
    !paginatedResults ||
    (paginatedResults &&
      paginatedResults.total >
        paginatedResults.limit * (paginatedResults.offset + 1))
  );
}
