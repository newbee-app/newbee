import {
  organizationFeature,
  qnaFeature,
} from '@newbee/newbee/shared/data-access';
import {
  OrgRoleEnum,
  Team,
  addToArrayIfUnique,
  compareOrgRoles,
} from '@newbee/shared/util';
import { createSelector } from '@ngrx/store';

/**
 * A selector for selecting the teams that should be displayed for creating or editing a qna.
 */
export const selectQnaTeams = createSelector(
  qnaFeature.selectSelectedQna,
  organizationFeature.selectOrgState,
  (selectedQna, orgState): Team[] => {
    const { selectedOrganization, orgMember } = orgState;
    if (!selectedOrganization || !orgMember) {
      return [];
    } else if (
      !selectedQna ||
      (selectedQna &&
        !selectedQna.qna.answerMarkdoc &&
        !selectedQna.qna.answerHtml) ||
      compareOrgRoles(orgMember.orgMember.role, OrgRoleEnum.Moderator) >= 0
    ) {
      return selectedOrganization.teams;
    } else if (selectedQna && selectedQna.team) {
      const orgMemberTeams = orgMember.teams.map((team) => team.team);
      return addToArrayIfUnique(orgMemberTeams, selectedQna.team, false);
    }

    return orgMember.teams.map((team) => team.team);
  },
);
