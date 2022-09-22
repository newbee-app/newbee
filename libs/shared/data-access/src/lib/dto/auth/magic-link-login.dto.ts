import { IsNumberString, IsOptional } from 'class-validator';

export class MagicLinkLoginDto {
  @IsOptional()
  @IsNumberString()
  jwtId!: string | null;
}
