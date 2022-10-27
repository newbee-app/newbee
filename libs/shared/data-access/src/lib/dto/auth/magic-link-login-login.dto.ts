import { User } from '@newbee/shared/util';
import { IsDefined, IsEmail } from 'class-validator';

export class MagicLinkLoginLoginDto implements Pick<User, 'email'> {
  @IsDefined()
  @IsEmail()
  email!: string;
}
