import { valueOrArray } from './value-or-array.function';

describe('valueOrArray', () => {
  it('should return value if prev is null or undefined', () => {
    expect(valueOrArray(1)).toEqual(1);
    expect(valueOrArray(1, null)).toEqual(1);
    expect(valueOrArray(1, undefined)).toEqual(1);
  });

  it('should return array with prev if prev is defined', () => {
    expect(valueOrArray(1, 0)).toEqual([0, 1]);
    expect(valueOrArray(2, [0, 1])).toEqual([0, 1, 2]);
  });
});
