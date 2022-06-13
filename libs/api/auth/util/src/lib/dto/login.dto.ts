import { User } from '@newbee/api/shared/data-access';
import { IsDefined, IsJWT, IsObject } from 'class-validator';

export class LoginDto {
  @IsDefined()
  @IsJWT()
  access_token!: string;

  @IsDefined()
  @IsObject()
  user!: User;
}
