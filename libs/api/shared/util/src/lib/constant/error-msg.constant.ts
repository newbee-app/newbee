export const internalServerErrorMsg =
  'We are experiencing issues on our end, sorry about that. Please try again later.';

export function idNotFoundErrorMsg(
  typeArticle: 'a' | 'an',
  type: string,
  idTypeArticle: 'a' | 'an',
  idType: string,
  id: string
): string {
  return `We could not find ${typeArticle} ${type} with ${idTypeArticle} ${idType} value of ${id}, please check the ${idType} value and try again,`;
}

export function idNotFoundLogMsg(
  operation: string,
  typeArticle: 'a' | 'an',
  type: string,
  idType: string,
  id: string
): string {
  return `Attempted to ${operation} ${typeArticle} ${type} with an invalid ${idType}: ${id}`;
}

export function createConflictLogMsg(
  article: 'a' | 'an',
  type: string,
  idType: string,
  id: string
): string {
  return `Attempted to create ${article} ${type} with an existing ${idType}: ${id}`;
}

export const badRequestAuthenticatorErrorMsg =
  'We could not verify this authenticator, please ensure you are using a previously registered authenticator and try again.';

export function challengeFalsyLogMsg(
  operation: 'login' | 'registration',
  challenge: string | undefined | null,
  userId: string
): string {
  return `Attempted to verify a ${operation} response even though user's challenge string is ${challenge} for user: ${userId}`;
}
