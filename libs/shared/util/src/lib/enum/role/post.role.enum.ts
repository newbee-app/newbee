/**
 * All of the possible roles a user can have regarding posts.
 */
export enum PostRoleEnum {
  Creator = 'Post Creator',
  Maintainer = 'Post Owner',
}

/**
 * PostRoleEnum as a set.
 */
export const postRoleEnumSet: Set<string> = new Set(
  Object.values(PostRoleEnum),
);

/**
 * For use in permissions, allow either creators or maintainers to access a resource.
 */
export const creatorOrMaintainer = [
  PostRoleEnum.Creator,
  PostRoleEnum.Maintainer,
];
