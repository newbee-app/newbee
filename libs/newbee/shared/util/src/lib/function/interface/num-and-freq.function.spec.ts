import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Frequency } from '../../enum';
import { NumAndFreq, NumAndFreqInput } from '../../interface';
import {
  durationToNumAndFreq,
  numAndFreqInputToDuration,
  numAndFreqIsDistinct,
  numAndFreqToDuration,
} from './num-and-freq.function';

dayjs.extend(duration);

describe('NumAndFreq functions', () => {
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
      expect(numAndFreqIsDistinct(null, null)).toBeFalsy();
      expect(
        numAndFreqIsDistinct(null, { num: null, frequency: null }),
      ).toBeFalsy();
      expect(
        numAndFreqIsDistinct(null, { num: 1, frequency: null }),
      ).toBeFalsy();
      expect(
        numAndFreqIsDistinct(null, { num: null, frequency: Frequency.Year }),
      ).toBeFalsy();
    });
  });

  describe('durationToNumAndFreq', () => {
    it('should convert accurately', () => {
      let duration = dayjs.duration('P1Y');
      expect(durationToNumAndFreq(duration)).toEqual({
        num: 1,
        frequency: Frequency.Year,
      });

      duration = dayjs.duration({ years: 1, months: 2 });
      expect(durationToNumAndFreq(duration)).toEqual({
        num: 1,
        frequency: Frequency.Year,
      });

      duration = dayjs.duration('P14M');
      expect(durationToNumAndFreq(duration)).toEqual({
        num: 14,
        frequency: Frequency.Month,
      });
    });
  });

  describe('numAndFreqToDuration', () => {
    it('should convert accurately', () => {
      const numAndFreq: NumAndFreq = { num: 1, frequency: Frequency.Year };
      expect(numAndFreqToDuration(numAndFreq)).toEqual(
        dayjs.duration(1, 'year'),
      );
    });
  });

  describe('numAndFreqInputToDuration', () => {
    it('should convert accurately', () => {
      let numAndFreq: NumAndFreqInput | null = {
        num: null,
        frequency: null,
      };
      expect(numAndFreqInputToDuration(numAndFreq)).toBeNull();

      numAndFreq = null;
      expect(numAndFreqInputToDuration(numAndFreq)).toBeNull();

      numAndFreq = { num: 0, frequency: Frequency.Year };
      expect(numAndFreqInputToDuration(numAndFreq)).toBeNull();

      numAndFreq = { num: 1, frequency: null };
      expect(numAndFreqInputToDuration(numAndFreq)).toBeNull();

      numAndFreq = { num: null, frequency: Frequency.Year };
      expect(numAndFreqInputToDuration(numAndFreq)).toBeNull();

      numAndFreq = { num: 1, frequency: Frequency.Year };
      expect(numAndFreqInputToDuration(numAndFreq)).toEqual(
        dayjs.duration(1, 'year'),
      );
    });
  });
});
