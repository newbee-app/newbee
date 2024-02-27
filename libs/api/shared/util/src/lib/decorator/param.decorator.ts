import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  docKey,
  organizationKey,
  orgMemberKey,
  qnaKey,
  subjectOrgMemberKey,
  subjectTeamMemberKey,
  teamKey,
  teamMemberKey,
  userKey,
} from '../constant';

/**
 * The decorator used to extract the `DocEntity` appended to the request by the `RoleGuard`.
 * Used in the parameter of a controller function.
 */
export const Doc = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const doc = request[docKey];
    return data ? doc?.[data] : doc;
  },
);

/**
 * The deocrator used to extract the `OrgMemberEntity` appended to the request by the `RoleGuard`.
 * Used in the parameter of a controller function.
 */
export const OrgMember = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const orgMember = request[orgMemberKey];
    return data ? orgMember?.[data] : orgMember;
  },
);

/**
 * The decorator used to extract the `OrganizationEntity` appended to the request by the `RoleGuard`.
 * Used in the parameter of a controller function.
 */
export const Organization = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const organization = request[organizationKey];
    return data ? organization?.[data] : organization;
  },
);

/**
 * The decorator used to extract the `QnaEntity` appended to the request by the `RoleGuard`.
 * Used in the parameter of a controller function.
 */
export const Qna = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const qna = request[qnaKey];
    return data ? qna?.[data] : qna;
  },
);

/**
 * The decorator used to extract the `OrgMemberEntity` appended to the request by the `RoleGuard`.
 * Used in the parameter of a controller function.
 */
export const SubjectOrgMember = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const subjectOrgMember = request[subjectOrgMemberKey];
    return data ? subjectOrgMember?.[data] : subjectOrgMember;
  },
);

/**
 * The decorator used to extract the `TeamMemberEntity` appended to the request by the `RoleGuard`.
 * Used in the parameter of a controller function.
 */
export const SubjectTeamMember = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const subjectTeamMember = request[subjectTeamMemberKey];
    return data ? subjectTeamMember?.[data] : subjectTeamMember;
  },
);

/**
 * The decorator used to extract the `TeamMemberEntity` appended to the request by the `RoleGuard`.
 * Used in the parameter of a controller function.
 */
export const TeamMember = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const teamMember = request[teamMemberKey];
    return data ? teamMember?.[data] : teamMember;
  },
);

/**
 * The decorator used to extract the `TeamEntity` appended to the request by the `TeamGuard`.
 * Used in the parameter of a controller function.
 */
export const Team = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const team = request[teamKey];
    return data ? team?.[data] : team;
  },
);

/**
 * The decorator used to extract the `UserEntity` or user data object appended to the request by the `PassportModule`.
 * Used in the parameter of a controller function.
 */
export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request[userKey];
    return data ? user?.[data] : user;
  },
);
