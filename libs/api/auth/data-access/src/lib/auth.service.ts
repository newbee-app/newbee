import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserJwtPayload } from '@newbee/api/auth/util';
import { UserEntity } from '@newbee/api/shared/data-access';
import { LoginDto } from '@newbee/shared/data-access';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(user: UserEntity): LoginDto {
    const payload: UserJwtPayload = { email: user.email, sub: user.id };
    return { access_token: this.jwtService.sign(payload), user };
  }
}
