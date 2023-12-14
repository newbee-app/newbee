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
    create: anyOrgMember,
    get: anyOrgMember,
    update: anyOrgMember,
    markUpToDate: anyOrgMember,
    delete: [
      atLeastOrgModerator,
      atLeastTeamModerator,
      PostRoleEnum.Maintainer,
    ].flat(),
  },
  [Keyword.OrgMember]: {
    getBySlug: anyOrgMember,
    update: [atLeastOrgModerator, ConditionalRoleEnum.OrgRoleGteSubject].flat(),
    delete: [atLeastOrgModerator, ConditionalRoleEnum.OrgRoleGteSubject].flat(),
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
    create: anyOrgMember,
    get: anyOrgMember,
    updateQuestion: anyOrgMember,
    updateAnswer: anyOrgMember,
    markUpToDate: anyOrgMember,
    delete: [
      atLeastOrgModerator,
      atLeastTeamModerator,
      PostRoleEnum.Maintainer,
    ].flat(),
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
    update: [atLeastOrgModerator, atLeastTeamModerator].flat(),
    delete: [atLeastOrgModerator, TeamRoleEnum.Owner].flat(),
  },
  [Keyword.TeamMember]: {
    create: [atLeastOrgModerator, anyTeamMember].flat(),
    update: [
      atLeastOrgModerator,
      atLeastTeamModerator,
      ConditionalRoleEnum.TeamRoleGteSubject,
    ].flat(),
    delete: [
      atLeastOrgModerator,
      atLeastTeamModerator,
      ConditionalRoleEnum.TeamRoleGteSubject,
    ].flat(),
  },
};
