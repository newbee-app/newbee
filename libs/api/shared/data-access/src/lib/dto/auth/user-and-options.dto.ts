import { BaseUserAndOptionsDto } from '@newbee/shared/data-access';
import { UserEntity } from '../../entity';

/**
 * A serializable DTO sent from the backend to the frontend representing a newly created user and its WebAuthn registration options.
 */
export class UserAndOptionsDto extends BaseUserAndOptionsDto {
  /**
   * The user represented as a `UserEntity`.
   */
  override user!: UserEntity;
}
