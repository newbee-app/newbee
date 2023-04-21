import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { docKey } from '../constant';

/**
 * The decorator used to extract the `DocEntity` appended to the request by the `RoleGuard`.
 * Used in the parameter of a controller function.
 */
export const Doc = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const doc = request[docKey];
    return data ? doc?.[data] : doc;
  }
);
