import { BaseUpdateUserDto } from '@newbee/shared/data-access';
import {
  activeIsBoolean,
  displayNameIsNotEmpty,
  emailIsEmail,
  nameIsNotEmpty,
  phoneNumberIsPhoneNumber,
} from '@newbee/shared/util';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

/**
 * The DTO sent from the frontend to the backend for updating the user's value.
 * Suitable for use in PATCH requests.
 */
export class UpdateUserDto implements BaseUpdateUserDto {
  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsEmail(undefined, {
    message: emailIsEmail,
  })
  email?: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: nameIsNotEmpty })
  name?: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: displayNameIsNotEmpty })
  displayName?: string | null;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsPhoneNumber(undefined, {
    message: phoneNumberIsPhoneNumber,
  })
  phoneNumber?: string | null;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsBoolean({ message: activeIsBoolean })
  active?: boolean;
}
