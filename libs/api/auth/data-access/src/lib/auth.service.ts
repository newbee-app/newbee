import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, UserJwtPayload } from '@newbee/api/auth/util';
import { User } from '@newbee/api/shared/data-access';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(user: User): LoginDto {
    const payload: UserJwtPayload = { email: user.email, sub: user.id };
    return { access_token: this.jwtService.sign(payload), user };
  }
}
