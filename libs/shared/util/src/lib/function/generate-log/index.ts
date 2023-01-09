/**
 * The message to send to the logger when a user challenge is `null`, even though we expect it to have a truthy value.
 */
export function challengeFalsy(
  operation: 'login' | 'registration',
  challenge: string | undefined | null,
  userId: string
): string {
  return `Attempted to verify a ${operation} response even though user's challenge string is ${challenge} for user: ${userId}`;
}
