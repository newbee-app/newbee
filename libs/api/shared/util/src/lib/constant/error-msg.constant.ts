export const internalServerErrorMsg =
  'We are experiencing issues on our end, sorry about that. Please try again later.';

export function idNotFoundErrorMsg(
  article: 'a' | 'an',
  type: string,
  id: string
): string {
  return `We could not find ${article} ${type} with an ID value of ${id}, please check the ID value and try again,`;
}

export function idNotFoundLogMsg(
  operation: string,
  article: 'a' | 'an',
  type: string,
  id: string
): string {
  return `Attempted to ${operation} ${article} ${type} with invalid ID: ${id}`;
}

export function createConflictLogMsg(
  article: 'a' | 'an',
  type: string,
  idType: string,
  id: string
): string {
  return `Attempted to create ${article} ${type} with an existing ${idType}: ${id}`;
}

export function unauthorizedLogMsg(
  operation: string,
  userId: string,
  attemptedId: string
): string {
  return `Attempted to ${operation} for user ${userId}, even though user is logged in as ${attemptedId}`;
}

export const unauthorizedErrorMsg = 'You do not have permissions to do this.';
