/**
 * All of the possible roles a user can have in an instance of NewBee.
 */
export enum UserRoleEnum {
  User = 'user',
  Admin = 'admin',
}

/**
 * The ordering for UserRoleEnum in ascending order.
 */
export const ascUserRoleEnum = [UserRoleEnum.User, UserRoleEnum.Admin];
