import { IsEmail, IsPhoneNumber } from 'class-validator';

export class MagicLoginRegisterDto {
  @IsEmail()
  destination!: string; // email
  firstName!: string;
  lastName!: string;
  displayName?: string;
  @IsPhoneNumber()
  phoneNumber?: string;
}
