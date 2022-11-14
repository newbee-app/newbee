import { MailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserEntity } from '@newbee/api/shared/data-access';
import type { AppConfigInterface } from '@newbee/api/shared/util';
import { internalServerErrorMsg } from '@newbee/api/shared/util';
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
    configService: ConfigService<AppConfigInterface, true>
  ) {
    const magicLinkLoginConfig = configService.get('auth.magicLinkLogin', {
      infer: true,
    });
    const sendMagicLink: SendMagicLinkFunction = async (
      payload: SendPayload,
      link: string,
      code: string
    ): Promise<void> => {
      const { email } = payload;
      if (!(await this.userService.findOneByEmail(email))) {
        this.logger.error(
          `Cannot send magic link to email ${email} as no user with that email exists`
        );
        throw new NotFoundException(
          `We could not send a login email to ${email} as no user with that email exists. Please check the email and try again!`
        );
      }

      try {
        await mailerService.sendMail({
          to: payload.email,
          subject: 'Your NewBee Magic Login Link 🪄🎩',
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

  async validate(payload: ValidatePayload): Promise<UserEntity> {
    this.logger.log(
      `Magic Link Login validate request received for payload: ${JSON.stringify(
        payload
      )}`
    );

    const { email } = payload;
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      this.logger.error(`User not found for email: ${email}`);
      throw new UnauthorizedException(
        'There is an issue with your credentials, please try logging in again.'
      );
    }

    this.logger.log(`User found for email: ${email}`);
    return user;
  }
}
