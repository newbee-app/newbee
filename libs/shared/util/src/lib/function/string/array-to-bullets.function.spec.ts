import { arrayToBullets } from './array-to-bullets.function';

describe('arrayToBullets', () => {
  it('should convert an array of strings to a single bullet point type string', () => {
    const testArray = ['hello', 'world'];
    const expectedString = '- hello\n- world';
    expect(arrayToBullets(testArray)).toEqual(expectedString);
  });
});
