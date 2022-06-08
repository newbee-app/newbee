import { IsDefined, IsOptional, IsPhoneNumber } from 'class-validator';
import { MagicLoginLoginDto } from './magic-login-login.dto';

export class MagicLoginRegisterDto extends MagicLoginLoginDto {
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
