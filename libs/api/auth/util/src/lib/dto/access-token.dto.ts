import { IsDefined, IsJWT } from 'class-validator';

export class AccessTokenDto {
  @IsDefined()
  @IsJWT()
  access_token!: string;
}
