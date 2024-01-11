import { TotalAndOffset } from './total-and-offset.interface';

/**
 * Used to describe a paignated set of results.
 */
export interface Result<Type> extends TotalAndOffset {
  /**
   * The current set of results.
   */
  results: Type[];
}
