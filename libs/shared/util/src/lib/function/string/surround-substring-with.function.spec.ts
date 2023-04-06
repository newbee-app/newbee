import {
  surroundSubstringsWith,
  surroundSubstringWith,
} from './surround-substring-with.function';

describe('surroundSubstringWith', () => {
  it('should pad a substring', () => {
    const str = 'Hello world, hello world';
    expect(surroundSubstringWith(str, 'Hello', '<b>', '</b>', false)).toEqual(
      '<b>Hello</b> world, hello world'
    );
    expect(surroundSubstringWith(str, 'hello', '<b>', '</b>', true)).toEqual(
      '<b>Hello</b> world, <b>hello</b> world'
    );
  });
});

describe('surroundSubstringsWith', () => {
  it('should pad all substrings', () => {
    const str = 'Hello world, mello yello, random things';
    expect(
      surroundSubstringsWith(str, ['hello', 'MELLO'], '<b>', '</b>', true)
    ).toEqual('<b>Hello</b> world, <b>mello</b> yello, random things');
    expect(
      surroundSubstringsWith(str, ['hello', 'MELLO'], '<b>', '</b>', false)
    ).toEqual(str);
    expect(
      surroundSubstringsWith(str, ['world', 'world'], '<b>', '</b>', true)
    ).toEqual('Hello <b><b>world</b></b>, mello yello, random things');
  });
});
