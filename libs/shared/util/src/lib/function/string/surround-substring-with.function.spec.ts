import { surroundSubstringWith } from './surround-substring-with.function';

describe('surroundSubstringWith', () => {
  it('should pad a substring', () => {
    const str = 'Hello world, hello world';
    expect(surroundSubstringWith(str, 'Hello', '<b>', '</b>', false)).toEqual(
      '<b>Hello</b> world, hello world',
    );
    expect(surroundSubstringWith(str, 'hello', '<b>', '</b>', true)).toEqual(
      '<b>Hello</b> world, <b>hello</b> world',
    );
  });

  it(`should do nothing if there's no match`, () => {
    const str = 'Hello world';
    expect(surroundSubstringWith(str, 'random', '<b>', '</b>')).toEqual(str);
  });
});
