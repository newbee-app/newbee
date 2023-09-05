import { testDoc1, testPost1, testQna1 } from '../../example';
import { postIsDoc, postIsQna } from './post.type-guard.function';

describe('post type guards', () => {
  describe('postIsDoc', () => {
    it('should return true if post is doc', () => {
      expect(postIsDoc(testPost1)).toBeFalsy();
      expect(postIsDoc(testQna1)).toBeFalsy();
      expect(postIsDoc(testDoc1)).toBeTruthy();
    });
  });

  describe('postIsQna', () => {
    it('should return true if post is qna', () => {
      expect(postIsQna(testPost1)).toBeFalsy();
      expect(postIsQna(testDoc1)).toBeFalsy();
      expect(postIsQna(testQna1)).toBeTruthy();
    });
  });
});
