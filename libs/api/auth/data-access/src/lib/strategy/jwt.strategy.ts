import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
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
    super(configService.get('auth.jwtStrategy', { infer: true }));
  }

  async validate(payload: UserJwtPayload): Promise<UserEntity> {
    this.logger.log(
      `JWT validate request received for payload: ${JSON.stringify(payload)}`
    );

    const { sub: id } = payload;
    const user = await this.userService.findOneById(id);
    if (!user) {
      this.logger.error(`User not found for ID: ${id}`);
      throw new UnauthorizedException(
        'There is an issue with your credentials, please try logging in again.'
      );
    }

    this.logger.log(`User found with ID: ${id}`);
    return user;
  }
}
