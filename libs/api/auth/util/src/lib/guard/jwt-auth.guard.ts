import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@newbee/api/shared/util';
import { Observable } from 'rxjs';
import { jwt } from '../constant';

/**
 * The `AuthGuard` for the JWT Strategy.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard(jwt) {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  /**
   * Allows users to access a given route if its metadata is decorated with `IS_PUBLIC_KEY`.
   *
   * @param context The context of the request.
   *
   * @returns Whether the given API route can be activated.
   */
  override canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
