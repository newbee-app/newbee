import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserEntity } from '@newbee/api/shared/data-access';
import {
  IS_PUBLIC_KEY,
  emailVerificationDeadline,
} from '@newbee/api/shared/util';
import dayjs from 'dayjs';

/**
 * A guard that prevents users from accessing non-public endpoints if they haven't verified their emails by a certain deadline.
 */
@Injectable()
export class EmailVerifiedGuard implements CanActivate {
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
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;
    return (
      user.emailVerified ||
      dayjs(user.createdAt).add(emailVerificationDeadline).toDate() > new Date()
    );
  }
}
