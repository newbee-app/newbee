import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthConfigInterface, UserJwtDto } from '@newbee/api/auth/util';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService<AuthConfigInterface, true>) {
    super(configService.get('auth.jwtStrategy', { infer: true }));
  }

  async validate(payload: UserJwtDto): Promise<UserJwtDto> {
    return payload;
  }
}
