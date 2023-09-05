import type { User } from '../../interface';

/**
 * Returns a user's display name if it's not null, otherwise returns their display name.
 * @param user The user in question.
 * @returns The user's display name if it's not null, their name otherwise.
 */
export function userDisplayName(user: User): string {
  return user.displayName ?? user.name;
}
