import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { orgMemberKey } from '../constant';

/**
 * The deocrator used to extract the `OrgMemberEntity` appended to the request by the `RoleGuard`.
 * Used in the parameter of a controller function.
 */
export const OrgMember = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const orgMember = request[orgMemberKey];
    return data ? orgMember?.[data] : orgMember;
  }
);
