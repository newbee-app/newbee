import { nbDayjs } from '../../dayjs';
import { Frequency } from '../../enum';
import { durationToNumAndFreq } from './duration-to-num-and-freq.function';

describe('dayjs', () => {
  describe('durationToNumAndFreq', () => {
    it('should convert accurately', () => {
      let duration = nbDayjs.duration('P1Y');
      expect(durationToNumAndFreq(duration)).toEqual({
        num: 1,
        frequency: Frequency.Year,
      });

      duration = nbDayjs.duration({ years: 1, months: 2 });
      expect(durationToNumAndFreq(duration)).toEqual({
        num: 1,
        frequency: Frequency.Year,
      });

      duration = nbDayjs.duration('P14M');
      expect(durationToNumAndFreq(duration)).toEqual({
        num: 14,
        frequency: Frequency.Month,
      });
    });
  });
});
