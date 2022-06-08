import { IsEmail } from 'class-validator';

export class MagicLoginLoginDto {
  @IsEmail()
  destination!: string; // email
}
