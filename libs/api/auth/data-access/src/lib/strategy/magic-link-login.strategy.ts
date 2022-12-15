import { MailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AppAuthConfig } from '@newbee/api/auth/util';
import { UserEntity } from '@newbee/api/shared/data-access';
import { internalServerErrorMsg } from '@newbee/api/shared/util';
import { UserService } from '@newbee/api/user/data-access';
import {
  MagicLinkLoginStrategy as Strategy,
  Payload,
  SendMagicLinkFunction,
} from '@newbee/passport-magic-link-login';

/**
 * The Nest Passport Strategy for the Magic Link Login Strategy.
 */
@Injectable()
export class MagicLinkLoginStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(MagicLinkLoginStrategy.name);

  constructor(
    private readonly userService: UserService,
    mailerService: MailerService,
    configService: ConfigService<AppAuthConfig, true>
  ) {
    const magicLinkLoginConfig = configService.get('auth.magicLinkLogin', {
      infer: true,
    });
    const sendMagicLink: SendMagicLinkFunction = async (
      payload: Payload,
      link: string,
      code: string
    ): Promise<void> => {
      const { email } = payload;
      await this.userService.findOneByEmail(email);
      try {
        await mailerService.sendMail({
          to: payload.email,
          subject: 'Your NewBee Magic Login Link',
          text: `Code: ${code}\nPlease click the link below to login to your NewBee account: ${link}`,
          html: `<p>Code: ${code}</p><p>Please click the link below to login to your NewBee account: <a href="${link}">${link}</a></p>`,
        });
      } catch (err) {
        this.logger.error(err);
        throw new InternalServerErrorException(internalServerErrorMsg);
      }
    };

    super({
      ...magicLinkLoginConfig,
      sendMagicLink,
    });
  }

  /**
   * Called after the user's magic link token has already been verified.
   * Uses the verified payload to find the corresponding `UserEntity` instance in the database.
   *
   * @param payload The payload that's unraveled after verifying the user's authentication token.
   *
   * @returns The `UserEntity` instance associated with the payload.
   */
  async validate(payload: Payload): Promise<UserEntity> {
    this.logger.log(
      `Magic Link Login validate request received for payload: ${JSON.stringify(
        payload
      )}`
    );

    const { email } = payload;
    const user = await this.userService.findOneByEmail(email);
    return user;
  }
}
