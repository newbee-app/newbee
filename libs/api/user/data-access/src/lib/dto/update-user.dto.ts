import { BaseUpdateUserDto } from '@newbee/shared/data-access';
import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto implements BaseUpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  displayName?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;
}
