import type { DocRelation, QnaRelation, User } from '../interface';
import { CreatorOrMaintainer, DocQueryResult, QnaQueryResult } from '../type';

/**
 * Returns a user's display name if it's not null, otherwise returns their display name.
 *
 * @param user The user in question.
 *
 * @returns The user's display name if it's not null, their name otherwise.
 */
export function userDisplayName(user: User): string {
  return user.displayName ?? user.name;
}

/**
 * Returns a user's display name with its email in parethenses after.
 *
 * @param user The user in question.
 *
 * @returns The user's display name with its email after.
 */
export function userDisplayNameAndEmail(user: User): string {
  return `${userDisplayName(user)} (${user.email})`;
}

/**
 * Whether the given post relation has the same org member as its maintainer and creator.
 *
 * @param post The post relation in question.
 *
 * @returns `true` if the post's maintainer is the same as its creator, `false` otherwise.
 */
export function maintainerIsCreator(
  post:
    | Pick<DocRelation, CreatorOrMaintainer>
    | Pick<QnaRelation, CreatorOrMaintainer>
    | DocQueryResult
    | QnaQueryResult,
): boolean {
  const { maintainer, creator } = post;
  return !!(
    maintainer &&
    creator &&
    maintainer.orgMember.slug === creator.orgMember.slug
  );
}

/**
 * Whether the given date should be considered up-to-date.
 * It relies on the user's browser's system clock, so there is a chance it can be inaccurate (although that should not happen frequently).
 *
 * @param outOfDateAt The date to examine.
 *
 * @returns `true` if the date is up-to-date, `false` otherwise.
 */
export function isUpToDate(outOfDateAt: string | Date): boolean {
  return new Date() < new Date(outOfDateAt);
}
