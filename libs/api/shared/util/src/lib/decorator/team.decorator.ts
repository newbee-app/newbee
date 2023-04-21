import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { teamKey } from '../constant';

/**
 * The decorator used to extract the `TeamEntity` appended to the request by the `TeamGuard`.
 * Used in the parameter of a controller function.
 */
export const Team = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const team = request[teamKey];
    return data ? team?.[data] : team;
  }
);
