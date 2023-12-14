import { Frequency } from '../enum';

/**
 * A number and frequency, used to represent a duration.
 */
export interface NumAndFreq {
  /**
   * The number portion of the duration.
   */
  num: number;

  /**
   * The frequency unit of the duration.
   */
  frequency: Frequency;
}
