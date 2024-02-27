import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import {
  displayNameIsNotEmpty,
  emailIsEmail,
  nameIsNotEmpty,
  phoneNumberIsPhoneNumber,
} from '../../constant';
import type { PublicUser } from '../../interface';

/**
 * A DTO sent from the frontend to the backend to register a new user.
 * Suitable for use in POST requests.
 */
export class CreateUserDto implements PublicUser {
  /**
   * @inheritdoc
   */
  @IsEmail(undefined, { message: emailIsEmail })
  readonly email: string;

  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: nameIsNotEmpty })
  readonly name: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: displayNameIsNotEmpty })
  readonly displayName: string | null;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsPhoneNumber(undefined, { message: phoneNumberIsPhoneNumber })
  readonly phoneNumber: string | null;

  constructor(
    email: string,
    name: string,
    displayName: string | null,
    phoneNumber: string | null,
  ) {
    this.email = email;
    this.name = name;
    this.displayName = displayName;
    this.phoneNumber = phoneNumber;
  }
}
