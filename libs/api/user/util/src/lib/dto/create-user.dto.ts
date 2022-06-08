import { IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string;
  firstName!: string;
  lastName!: string;
  displayName?: string;
  @IsPhoneNumber()
  phoneNumber?: string;
}
