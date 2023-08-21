import type { Doc, Post, Qna } from '../../interface';

/**
 * Checks whether a given post is a doc.
 *
 * @param post The post to check.
 * @returns `true` if the post is a doc, `false` otherwise.
 */
export function postIsDoc(post: Post): post is Doc {
  return 'docMarkdoc' in post;
}

/**
 * Checks whether a given post is a qna.
 *
 * @param post The post to check.
 * @returns `true` if the post is a qna, `false` otherwise.
 */
export function postIsQna(post: Post): post is Qna {
  return 'questionMarkdoc' in post;
}
