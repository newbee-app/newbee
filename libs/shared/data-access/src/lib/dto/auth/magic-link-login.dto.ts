import { IsDefined, IsNumberString } from 'class-validator';

export class MagicLinkLoginDto {
  @IsDefined()
  @IsNumberString()
  jwtId!: string;
}
