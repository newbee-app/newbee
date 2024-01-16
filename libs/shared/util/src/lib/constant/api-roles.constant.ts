import {
  ConditionalRoleEnum,
  Keyword,
  OrgRoleEnum,
  PostRoleEnum,
  TeamRoleEnum,
  anyOrgMember,
  anyTeamMember,
  atLeastOrgModerator,
  atLeastTeamModerator,
} from '../enum';

/**
 * All of the roles attached to any API routes that have roles annotations.
 * Should be ordered alphabetically, for ease of reading.
 */
export const apiRoles = {
  [Keyword.Doc]: {
    getAllPaginated: anyOrgMember,
    create: anyOrgMember,
    get: anyOrgMember,
    update: anyOrgMember,
    markUpToDate: anyOrgMember,
    delete: [
      ...atLeastOrgModerator,
      ...atLeastTeamModerator,
      PostRoleEnum.Maintainer,
    ],
  },
  [Keyword.OrgMember]: {
    getBySlug: anyOrgMember,
    update: [...atLeastOrgModerator, ConditionalRoleEnum.OrgRoleGteSubject],
    delete: [...atLeastOrgModerator, ConditionalRoleEnum.OrgRoleGteSubject],
  },
  [Keyword.OrgMemberInvite]: {
    invite: anyOrgMember,
  },
  [Keyword.Organization]: {
    get: anyOrgMember,
    update: atLeastOrgModerator,
    delete: [OrgRoleEnum.Owner],
  },
  [Keyword.Qna]: {
    getAllPaginated: anyOrgMember,
    create: anyOrgMember,
    get: anyOrgMember,
    updateQuestion: anyOrgMember,
    updateAnswer: anyOrgMember,
    markUpToDate: anyOrgMember,
    delete: [
      ...atLeastOrgModerator,
      ...atLeastTeamModerator,
      PostRoleEnum.Maintainer,
    ],
  },
  [Keyword.Search]: {
    search: anyOrgMember,
    suggest: anyOrgMember,
  },
  [Keyword.Team]: {
    create: anyOrgMember,
    checkSlug: anyOrgMember,
    generateSlug: anyOrgMember,
    get: anyOrgMember,
    update: [...atLeastOrgModerator, ...atLeastTeamModerator],
    delete: [...atLeastOrgModerator, TeamRoleEnum.Owner],
  },
  [Keyword.TeamMember]: {
    create: [...atLeastOrgModerator, ...anyTeamMember],
    update: [
      ...atLeastOrgModerator,
      ...atLeastTeamModerator,
      ConditionalRoleEnum.TeamRoleGteSubject,
    ],
    delete: [
      ...atLeastOrgModerator,
      ...atLeastTeamModerator,
      ConditionalRoleEnum.TeamRoleGteSubject,
    ],
  },
};
