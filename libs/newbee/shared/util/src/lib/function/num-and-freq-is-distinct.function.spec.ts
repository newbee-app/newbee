import { Frequency } from '@newbee/shared/util';
import { numAndFreqIsDistinct } from './num-and-freq-is-distinct.function';

describe('numAndFreqIsDistinct', () => {
  it('should be true if 2 num and freqs are distinct, false otherwise', () => {
    expect(
      numAndFreqIsDistinct(
        { num: 1, frequency: Frequency.Year },
        { num: 1, frequency: Frequency.Year },
      ),
    ).toBeFalsy();
    expect(
      numAndFreqIsDistinct(
        { num: 2, frequency: Frequency.Year },
        { num: 1, frequency: Frequency.Year },
      ),
    ).toBeTruthy();
    expect(
      numAndFreqIsDistinct(
        { num: 1, frequency: Frequency.Year },
        { num: 1, frequency: Frequency.Month },
      ),
    ).toBeTruthy();
    expect(
      numAndFreqIsDistinct(null, { num: 1, frequency: Frequency.Year }),
    ).toBeTruthy();
    expect(numAndFreqIsDistinct(null, {})).toBeFalsy();
    expect(
      numAndFreqIsDistinct(null, { num: null, frequency: null }),
    ).toBeFalsy();
    expect(numAndFreqIsDistinct(null, { num: 1, frequency: null })).toBeFalsy();
    expect(
      numAndFreqIsDistinct(null, { num: null, frequency: Frequency.Year }),
    ).toBeFalsy();
  });
});
