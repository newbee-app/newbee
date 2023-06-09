import { SlugPipe } from './slug.pipe';

describe('SlugPipe', () => {
  let pipe: SlugPipe;

  beforeEach(() => {
    pipe = new SlugPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should transform a regular string into a slug', () => {
      expect(pipe.transform('Example With Spaces And unïcodé')).toEqual(
        'example-with-spaces-and-unicode'
      );
    });
  });
});
