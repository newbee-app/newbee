import dayjs from 'dayjs';
import { Duration } from 'dayjs/plugin/duration';
import { Frequency } from '../../enum';
import { NumAndFreq, NumAndFreqInput } from '../../interface';

/**
 * Whether the given nums and frequencies are distinct, for help in dealing with form controls on the frontend.
 *
 * @param numAndFreq The num and freq to check.
 * @param numAndFreqInput The form control num and freq to check.
 *
 * @returns `true` if the 2 nums and freqs are distinct, `false` otherwise.
 */
export function numAndFreqIsDistinct(
  numAndFreq: NumAndFreq | null,
  numAndFreqInput: NumAndFreqInput | null,
): boolean {
  const num = numAndFreqInput?.num ?? null;
  const frequency = numAndFreqInput?.frequency ?? null;
  return !!(
    (!numAndFreq && num && frequency) ||
    (numAndFreq &&
      (numAndFreq.num !== num || numAndFreq.frequency !== frequency))
  );
}

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

/**
 * Converts a NumAndFreq object to a dayjs duration.
 *
 * @param numAndFreq The object to convert.
 *
 * @returns The dayjs duration associated with the NumAndFreq object.
 */
export function numAndFreqToDuration(numAndFreq: NumAndFreq): Duration {
  const { num, frequency } = numAndFreq;
  return dayjs.duration(num, frequency);
}

/**
 * Converts a form NumAndFreqInput object to a dayjs duration. Does not allow any falsy value for number, meaning both `null` and `0` will return a null value.
 *
 * @param numAndFreqInput The input to convert.
 *
 * @returns The dayjs duration associated with the object, if it's possible to make. `null` otherwise.
 */
export function numAndFreqInputToDuration(
  numAndFreqInput: NumAndFreqInput | null,
): Duration | null {
  if (!numAndFreqInput) {
    return null;
  }

  const { num, frequency } = numAndFreqInput;
  return num && frequency ? dayjs.duration(num, frequency) : null;
}
