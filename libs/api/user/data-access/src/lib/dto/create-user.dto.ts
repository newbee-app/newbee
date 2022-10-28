import { BaseCreateUserDto } from '@newbee/shared/data-access';
import { IsDefined, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateUserDto implements BaseCreateUserDto {
  @IsDefined()
  @IsEmail()
  email!: string;

  @IsDefined()
  name!: string;

  @IsOptional()
  displayName?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;
}
