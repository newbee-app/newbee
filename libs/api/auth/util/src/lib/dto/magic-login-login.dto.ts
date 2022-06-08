import { IsDefined, IsEmail } from 'class-validator';

export class MagicLoginLoginDto {
  @IsDefined()
  @IsEmail()
  destination!: string; // email
}
