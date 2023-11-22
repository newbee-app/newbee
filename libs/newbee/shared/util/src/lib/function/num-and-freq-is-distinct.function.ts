import { Nullable, NumAndFreq } from '@newbee/shared/util';

/**
 * Whether the given num and frequencies are distinct, for help in dealing with form controls on the frontend.
 *
 * @param numAndFreq The num and freq to check.
 * @param controlNumAndFreq The form control num and freq to check.
 *
 * @returns `true` if the 2 num and freqs are distinct, `false` otherwise.
 */
export function numAndFreqIsDistinct(
  numAndFreq: NumAndFreq | null,
  controlNumAndFreq: Partial<Nullable<NumAndFreq>>,
): boolean {
  const num = controlNumAndFreq?.num;
  const frequency = controlNumAndFreq?.frequency;

  return !!(
    (!numAndFreq && num && frequency) ||
    (numAndFreq &&
      (numAndFreq.num !== num || numAndFreq.frequency !== frequency))
  );
}
