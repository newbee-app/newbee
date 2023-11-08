import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Frequency } from '../../enum';
import { durationToNumAndFreq } from './duration-to-num-and-freq.function';

dayjs.extend(duration);

describe('dayjs', () => {
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
});
