import {
  BaseCreateUserDto,
  displayNameIsNotEmpty,
  emailIsEmail,
  nameIsNotEmpty,
  phoneNumberIsPhoneNumber,
} from '@newbee/shared/util';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

/**
 * A verifiable DTO for sending the necessary information to register a new user from the frontend to the backend.
 * Suitable for use in POST requests.
 */
export class CreateUserDto implements BaseCreateUserDto {
  /**
   * @inheritdoc
   */
  @IsEmail(undefined, {
    message: emailIsEmail,
  })
  email!: string;

  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: nameIsNotEmpty })
  name!: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: displayNameIsNotEmpty })
  displayName: string | null = null;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsPhoneNumber(undefined, {
    message: phoneNumberIsPhoneNumber,
  })
  phoneNumber: string | null = null;
}
