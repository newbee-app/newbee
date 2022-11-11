import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { AuthConfigInterface } from '@newbee/api/auth/util';
import type { UserJwtPayload } from '@newbee/api/shared/util';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService<AuthConfigInterface, true>) {
    super(configService.get('auth.jwtStrategy', { infer: true }));
  }

  validate(payload: UserJwtPayload): UserJwtPayload {
    return payload;
  }
}
