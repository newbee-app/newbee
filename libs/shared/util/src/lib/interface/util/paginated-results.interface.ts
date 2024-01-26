import { OffsetAndLimit } from './offset-and-limit.interface';

/**
 * Used to describe a paignated set of results.
 */
export interface PaginatedResults<Type> extends OffsetAndLimit {
  /**
   * The current set of results.
   */
  results: Type[];

  /**
   * The total number of results that exist.
   */
  total: number;
}
