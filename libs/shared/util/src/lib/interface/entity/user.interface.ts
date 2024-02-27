import { UserRoleEnum } from '../../enum';
import { CommonEntityFields } from './common-entity-fields.interface';

/**
 * The information associated with a given user.
 * Stored as an entity in the backend.
 */
export interface User extends CommonEntityFields {
  /**
   * The globally unique email of the given user.
   */
  readonly email: string;

  /**
   * The full name of the given user.
   */
  readonly name: string;

  /**
   * How the user's name will be displayed on the platform, regardless of the value of name.
   * If the value is null, the user's name will be displayed.
   */
  readonly displayName: string | null;

  /**
   * The phone number of the given user, stored in the backend in E.164 format.
   */
  readonly phoneNumber: string | null;

  /**
   * The user's role in the given NewBee instance.
   */
  readonly role: UserRoleEnum;

  /**
   * Whether the user's email has been verified.
   */
  readonly emailVerified: boolean;
}

/**
 * The user information that is passed around to other users.
 */
export type PublicUser = Omit<
  User,
  keyof CommonEntityFields | 'role' | 'emailVerified'
>;
