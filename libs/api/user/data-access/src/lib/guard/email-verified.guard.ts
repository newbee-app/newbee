import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserEntity } from '@newbee/api/shared/data-access';
import {
  IS_PUBLIC_KEY,
  UNVERIFIED_OK_KEY,
  emailVerificationDeadline,
} from '@newbee/api/shared/util';
import { emailUnverifiedForbiddenError } from '@newbee/shared/util';
import dayjs from 'dayjs';

/**
 * A guard that prevents users from accessing non-public endpoints if they haven't verified their emails by a certain deadline.
 */
@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  private readonly logger = new Logger(EmailVerifiedGuard.name);

  constructor(private readonly reflector: Reflector) {}

  /**
   * Allowers users to access a given route if:
   *
   * - The route is public.
   * - The user has verified their email.
   * - The user has not verified their email but it is currently before the email verification deadline.
   *
   * @param context The context of the request.
   *
   * @returns `true` if the route is public, the user has verified their email
   */
  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const unverifiedOk = this.reflector.getAllAndOverride<boolean>(
      UNVERIFIED_OK_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic || unverifiedOk) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;
    if (
      user.emailVerified ||
      dayjs(user.createdAt).add(emailVerificationDeadline).toDate() > new Date()
    ) {
      return true;
    }

    this.logger.log(
      `Email is unverified for user ID: ${user.id}, throwing forbidden exception`,
    );
    throw new ForbiddenException(emailUnverifiedForbiddenError);
  }
}
