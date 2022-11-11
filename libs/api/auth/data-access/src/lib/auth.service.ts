import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@newbee/api/shared/data-access';
import type { UserJwtPayload } from '@newbee/api/shared/util';
import { BaseLoginDto } from '@newbee/shared/data-access';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(user: UserEntity): BaseLoginDto {
    const payload: UserJwtPayload = { email: user.email, sub: user.id };
    return { access_token: this.jwtService.sign(payload), user };
  }
}
