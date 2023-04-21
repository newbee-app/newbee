import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { teamMemberKey } from '../constant';

/**
 * The decorator used to extract the `TeamMemberEntity` appended to the request by the `RoleGuard`.
 * Used in the parameter of a controller function.
 */
export const TeamMember = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const teamMember = request[teamMemberKey];
    return data ? teamMember?.[data] : teamMember;
  }
);
