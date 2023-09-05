import { stripHtmlTags } from './strip-html-tags.function';

describe('stripHtmlTags', () => {
  it('should strip HTML tags from string', () => {
    expect(stripHtmlTags('hello world')).toEqual('hello world');
    expect(stripHtmlTags('<strong>hello</strong> world')).toEqual(
      'hello world'
    );
  });
});
