import {
  BadRequestException,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  Keyword,
  ingestValue,
  magicLinkLoginBadRequest,
} from '@newbee/shared/util';

/**
 * The `AuthGuard` for the Magic Link Login Strategy.
 */
@Injectable()
export class MagicLinkLoginAuthGuard extends AuthGuard(Keyword.MagicLinkLogin) {
  private readonly logger = new Logger(MagicLinkLoginAuthGuard.name);

  /**
   * Allows user to access a given route if they have a valid magic link login token.
   *
   * @param context The context of the request.
   *
   * @returns Whether the given API route can be activated.
   * @throws {BadRequestException} `magicLinkLoginBadRequest`. If something goes wrong with trying to validate the magic link login token.
   */
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return await ingestValue(super.canActivate(context));
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      this.logger.error(err);
      throw new BadRequestException(magicLinkLoginBadRequest);
    }
  }
}
