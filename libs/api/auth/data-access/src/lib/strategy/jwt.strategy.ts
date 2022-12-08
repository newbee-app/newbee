import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserEntity } from '@newbee/api/shared/data-access';
import type {
  AppConfigInterface,
  UserJwtPayload,
} from '@newbee/api/shared/util';
import { UserService } from '@newbee/api/user/data-access';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    configService: ConfigService<AppConfigInterface, true>,
    private readonly userService: UserService
  ) {
    super(configService.get('auth', { infer: true }).jwtStrategy);
  }

  async validate(payload: UserJwtPayload): Promise<UserEntity> {
    this.logger.log(
      `JWT validate request received for payload: ${JSON.stringify(payload)}`
    );

    const { sub: id } = payload;
    const user = await this.userService.findOneById(id);
    return user;
  }
}
