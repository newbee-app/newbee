import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthConfigInterface, MagicLoginPayload } from '@newbee/api/auth/util';
import { User } from '@newbee/api/shared/data-access';
import { UserService } from '@newbee/api/user/data-access';
import Strategy from 'passport-magic-login';

@Injectable()
export class MagicLoginStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    mailerService: MailerService,
    configService: ConfigService<AuthConfigInterface, true>
  ) {
    const magicLoginConfig = configService.get('magicLogin', {
      infer: true,
    });
    super({
      ...magicLoginConfig,
      sendMagicLink: async (
        destination: string, // email
        href: string
      ): Promise<void> => {
        await mailerService.sendMail({
          to: destination,
          subject: 'Your NewBee Magic Login Link 🪄🎩',
          text: `Please click on the following link to login: ${href}`,
          html: `<p>Please click on the following link to login:</p> <a href="${href}">${href}</a>`,
        });
      },
    });
  }

  // Called in MagicLoginAuthGuard
  async validate(payload: MagicLoginPayload): Promise<User> {
    const user = await this.userService.findOneByEmail(payload.destination);
    if (!user) {
      throw new UnauthorizedException(
        `User not found for email: ${payload.destination}`
      );
    }

    return user;
  }
}
