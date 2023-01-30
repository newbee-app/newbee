// Details all of the errors the `qna` portion of the backend can throw.

/**
 * Constant to say that a QnA with the given slug is already taken.
 */
export const qnaSlugTakenBadRequest =
  'The provided qna slug is already taken, please use a different slug.';

/**
 * Constant to say that a QnA with the given slug could not be found.
 */
export const qnaSlugNotFound =
  'We could not find a QnA associated with the provided slug. Please check the slug value and try again.';
