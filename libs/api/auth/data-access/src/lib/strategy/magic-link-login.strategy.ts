import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthConfigInterface } from '@newbee/api/auth/util';
import { UserEntity } from '@newbee/api/shared/data-access';
import { UserService } from '@newbee/api/user/data-access';
import {
  MagicLinkLoginStrategy as Strategy,
  SendMagicLinkFunction,
  SendPayload,
  ValidatePayload,
} from '@newbee/passport-magic-link-login';

@Injectable()
export class MagicLinkLoginStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(MagicLinkLoginStrategy.name);

  constructor(
    private readonly userService: UserService,
    mailerService: MailerService,
    configService: ConfigService<AuthConfigInterface, true>
  ) {
    const magicLinkLoginConfig = configService.get('auth.magicLinkLogin', {
      infer: true,
    });
    const sendMagicLink: SendMagicLinkFunction = async (
      payload: SendPayload,
      link: string,
      code: string
    ): Promise<void> =>
      await mailerService.sendMail({
        to: payload.email,
        subject: 'Your NewBee Magic Login Link 🪄🎩',
        text: `Code: ${code}\nPlease click the link below to login to your NewBee account: ${link}`,
        html: `<p>Code: ${code}</p><p>Please click the link below to login to your NewBee account: <a href="${link}">${link}</a></p>`,
      });

    super({
      ...magicLinkLoginConfig,
      sendMagicLink,
    });
  }

  async validate(payload: ValidatePayload): Promise<UserEntity> {
    this.logger.log(
      `Magic Link Login validate request received for payload: ${JSON.stringify(
        payload
      )}`
    );
    const user = await this.userService.findOneByEmail(payload.email);
    if (!user) {
      const errorMsg = `User not found for email: ${payload.email}`;
      this.logger.error(errorMsg);
      throw new UnauthorizedException(errorMsg);
    }

    this.logger.log(`User found for email: ${payload.email}`);
    return user;
  }
}
