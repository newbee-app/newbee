import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { subjectOrgMemberKey } from '../constant';

/**
 * The decorator used to extract the `OrgMemberEntity` appended to the request by the `RoleGuard`.
 * Used in the parameter of a controller function.
 */
export const SubjectOrgMember = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const subjectOrgMember = request[subjectOrgMemberKey];
    return data ? subjectOrgMember?.[data] : subjectOrgMember;
  }
);
