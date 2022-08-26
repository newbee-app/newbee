import { User } from '@newbee/shared/util';
import { IsDefined, IsJWT, IsObject } from 'class-validator';

export class LoginDto {
  @IsDefined()
  @IsJWT()
  access_token!: string;

  @IsDefined()
  @IsObject()
  user!: User;
}
