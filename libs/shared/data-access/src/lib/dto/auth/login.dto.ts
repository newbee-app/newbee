import { IsDefined, IsJWT, IsObject } from 'class-validator';
import { User } from '../../entity';

export class LoginDto {
  @IsDefined()
  @IsJWT()
  access_token!: string;

  @IsDefined()
  @IsObject()
  user!: User;
}
