import { BaseUpdateUserDto } from '@newbee/shared/data-access';
import { IsBoolean, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

/**
 * The DTO sent from the frontend to the backend for updating the user's value.
 * Suitable for use in PATCH requests.
 */
export class UpdateUserDto implements BaseUpdateUserDto {
  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsEmail()
  email?: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  name?: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  displayName?: string | null;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string | null;

  /**
   * @inheritdoc
   */
  @IsBoolean()
  active?: boolean;

  /**
   * @inheritdoc
   */
  @IsBoolean()
  online?: boolean;
}
