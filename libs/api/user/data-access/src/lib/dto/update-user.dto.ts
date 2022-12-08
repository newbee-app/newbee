import { BaseUpdateUserDto } from '@newbee/shared/data-access';
import { IsBoolean, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto implements BaseUpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  displayName?: string | null;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string | null;

  @IsBoolean()
  active?: boolean;

  @IsBoolean()
  online?: boolean;
}
