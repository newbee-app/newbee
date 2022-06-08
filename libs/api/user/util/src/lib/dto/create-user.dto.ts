import { IsDefined, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsEmail()
  email!: string;

  @IsDefined()
  firstName!: string;

  @IsDefined()
  lastName!: string;

  @IsOptional()
  displayName?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;
}
