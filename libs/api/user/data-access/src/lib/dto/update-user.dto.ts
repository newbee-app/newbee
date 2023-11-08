import {
  BaseUpdateUserDto,
  displayNameIsNotEmpty,
  nameIsNotEmpty,
  phoneNumberIsPhoneNumber,
} from '@newbee/shared/util';
import { IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';

/**
 * The DTO sent from the frontend to the backend for updating the user's value.
 * Suitable for use in PATCH requests.
 */
export class UpdateUserDto implements BaseUpdateUserDto {
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
}
