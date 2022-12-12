/**
 * The error message used whenever an `InternalServerErrorException` is thrown.
 */
export const internalServerErrorMsg =
  'We are experiencing issues on our end, sorry about that. Please try again later.';

/**
 * The error message used with a `NotFoundException` when a given type can't be found using the given ID.
 * Although we say ID, this can be used with different types of IDs.
 * For example, a UUID can be an ID, an email can be an ID, etc.
 *
 * @param typeArticle Whether to us 'a' or 'an' preceding the type.
 * @param type The name of the type.
 * @param idTypeArticle Whether to use 'a' or 'an' preceding the ID.
 * @param idType The name of the ID.
 * @param id The ID value itself.
 * @returns A string representing an error where an ID could not be found.
 */
export function idNotFoundErrorMsg(
  typeArticle: 'a' | 'an',
  type: string,
  idTypeArticle: 'a' | 'an',
  idType: string,
  id: string
): string {
  return `We could not find ${typeArticle} ${type} with ${idTypeArticle} ${idType} value of ${id}, please check the ${idType} value and try again,`;
}

/**
 * The error message used with a `BadRequestException` when there is a problem verifying an authenticator for WebAuthn authentication.
 */
export const badRequestAuthenticatorErrorMsg =
  'We could not verify this authenticator, please ensure you are using a previously registered authenticator and try again.';

/**
 * The message to send to the logger when a user challenge is `null`, even though we expect it to have a truthy value.
 */
export function challengeFalsyLogMsg(
  operation: 'login' | 'registration',
  challenge: string | undefined | null,
  userId: string
): string {
  return `Attempted to verify a ${operation} response even though user's challenge string is ${challenge} for user: ${userId}`;
}
