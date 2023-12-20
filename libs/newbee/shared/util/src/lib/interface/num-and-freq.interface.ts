import { Nullable } from '@newbee/shared/util';
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

/**
 * A nullable version of `NumAndFreq`, to be used as an input.
 */
export type NumAndFreqInput = Nullable<NumAndFreq>;
