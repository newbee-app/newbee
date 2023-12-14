import { addToArrayIfUnique } from './add-to-array-if-unique.function';

describe('addToArrayIfUnique', () => {
  it('should add to array if item is unique', () => {
    expect(addToArrayIfUnique(['hello'], 'hello')).toEqual(['hello']);
    expect(addToArrayIfUnique(['hello'], 'world')).toEqual(['hello', 'world']);
  });
});
