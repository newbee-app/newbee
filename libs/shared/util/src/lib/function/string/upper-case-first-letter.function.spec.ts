import { upperCaseFirstLetter } from './upper-case-first-letter.function';

describe('upperCaseFirstLetter', () => {
  it('should upper case the first letter of a string', () => {
    const testString = 'hello world';
    const expectedString = 'Hello world';
    expect(upperCaseFirstLetter(testString)).toEqual(expectedString);
  });
});
