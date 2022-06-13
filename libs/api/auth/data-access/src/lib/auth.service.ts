import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenDto, UserJwtDto } from '@newbee/api/auth/util';
import { User } from '@newbee/api/shared/data-access';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(user: User): AccessTokenDto {
    const payload: UserJwtDto = { email: user.email, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
