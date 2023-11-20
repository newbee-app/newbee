import type { Duration } from 'dayjs/plugin/duration';
import { Frequency } from '../../enum';
import { NumAndFreq } from '../../interface';

/**
 * Converts a dayjs duration into an object separating its number and frequency.
 * It is incompatible with durations specifying multiple units (e.g. it cannot handle 1 year & 2 months, but it could handle 14 months).
 *
 * @param duration The duration to convert.
 *
 * @returns An object containing the duration's number and frequency.
 */
export function durationToNumAndFreq(duration: Duration): NumAndFreq {
  const result = { num: 0, frequency: Frequency.Day };
  Object.values(Frequency)
    .reverse()
    .some((frequency) => {
      const num = duration.get(frequency);
      if (!num) {
        return false;
      }

      result.num = num;
      result.frequency = frequency;
      return true;
    });

  return result;
}
