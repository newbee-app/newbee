import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AppAuthConfig, UserJwtPayload } from '@newbee/api/auth/util';
import { UserEntity } from '@newbee/api/shared/data-access';
import { UserService } from '@newbee/api/user/data-access';
import { Strategy } from 'passport-jwt';

/**
 * The Nest Passport Strategy for the JWT Strategy.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly userService: UserService,
    configService: ConfigService<AppAuthConfig, true>,
  ) {
    super(configService.get('auth.jwtStrategy', { infer: true }));
  }

  /**
   * Called after the user's authentication token has already been verified.
   * Uses the verified payload to find the corresponding `UserEntity` instance in the database.
   *
   * @param payload The payload that's unraveled after verifying the user's authentication token.
   *
   * @returns The `UserEntity` instance associated with the payload.
   */
  async validate(payload: UserJwtPayload): Promise<UserEntity> {
    this.logger.log(
      `JWT validate request received for payload: ${JSON.stringify(payload)}`,
    );

    const { sub: id } = payload;
    const user = await this.userService.findOneById(id);
    return user;
  }
}
