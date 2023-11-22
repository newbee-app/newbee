import { renderMarkdoc } from './markdoc.function';

describe('markdoc functions', () => {
  describe('renderMarkdoc', () => {
    it('should handle falsy cases', () => {
      expect(renderMarkdoc(null)).toEqual({ txt: null, html: null });
      expect(renderMarkdoc(undefined)).toEqual({
        txt: undefined,
        html: undefined,
      });
      expect(renderMarkdoc('')).toEqual({ txt: '', html: '' });
    });

    it('should handle markdoc', () => {
      expect(renderMarkdoc('my markdoc')).toEqual({
        txt: 'my markdoc',
        html: '<article><p>my markdoc</p></article>',
      });
    });
  });
});
