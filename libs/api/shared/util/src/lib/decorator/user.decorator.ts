import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * The decorator used to extract the `UserEntity` or user data object appended to the request by the `PassportModule`.
 * Used in the parameter of a controller function.
 */
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  }
);
