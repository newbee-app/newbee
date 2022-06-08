import { IsEmail, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  @IsPhoneNumber()
  phoneNumber?: string;
  active?: boolean;
  online?: boolean;
}
