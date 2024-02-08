import { IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';
import {
  displayNameIsNotEmpty,
  nameIsNotEmpty,
  phoneNumberIsPhoneNumber,
} from '../../constant';
import { CreateUserDto } from './create-user.dto';

/**
 * The DTO sent from the frontend to the backend for updating the user's value.
 * Suitable for use in PATCH requests.
 */
export class UpdateUserDto implements Partial<Omit<CreateUserDto, 'email'>> {
  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: nameIsNotEmpty })
  readonly name?: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: displayNameIsNotEmpty })
  readonly displayName?: string | null;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsPhoneNumber(undefined, { message: phoneNumberIsPhoneNumber })
  readonly phoneNumber?: string | null;

  constructor(obj: UpdateUserDto) {
    Object.assign(this, obj);
  }
}
