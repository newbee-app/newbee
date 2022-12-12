import { BaseCreateUserDto } from '@newbee/shared/data-access';
import { IsDefined, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

/**
 * A verifiable DTO for sending the necessary information to register a new user from the frontend to the backend.
 * Suitable for use in POST requests.
 */
export class CreateUserDto implements BaseCreateUserDto {
  /**
   * @inheritdoc
   */
  @IsDefined()
  @IsEmail()
  email!: string;

  /**
   * @inheritdoc
   */
  @IsDefined()
  name!: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  displayName: string | null = null;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string | null = null;
}
