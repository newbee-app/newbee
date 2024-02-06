import { createArrayOrPush } from './create-array-or-push.function';

describe('createArrayOrPush', () => {
  it('should handle an existing array', () => {
    expect(createArrayOrPush(1, [0])).toEqual([0, 1]);
  });

  it('should handle null and undefined', () => {
    expect(createArrayOrPush(1, null)).toEqual([1]);
    expect(createArrayOrPush(1, undefined)).toEqual([1]);
  });

  it('should handle a simple prev value', () => {
    expect(createArrayOrPush(1, 0)).toEqual([0, 1]);
  });
});
