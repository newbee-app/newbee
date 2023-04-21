import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { subjectTeamMemberKey } from '../constant';

/**
 * The decorator used to extract the `TeamMemberEntity` appended to the request by the `RoleGuard`.
 * Used in the parameter of a controller function.
 */
export const SubjectTeamMember = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const subjectTeamMember = request[subjectTeamMemberKey];
    return data ? subjectTeamMember?.[data] : subjectTeamMember;
  }
);
