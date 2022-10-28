import { BaseMagicLinkLoginLoginDto } from '@newbee/shared/data-access';
import { IsDefined, IsEmail } from 'class-validator';

export class MagicLinkLoginLoginDto implements BaseMagicLinkLoginLoginDto {
  @IsDefined()
  @IsEmail()
  email!: string;
}
