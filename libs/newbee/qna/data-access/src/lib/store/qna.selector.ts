import {
  httpFeature,
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
import { isEqual } from 'lodash-es';

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
      return addToArrayIfUnique(
        orgMemberTeams,
        selectedQna.team,
        false,
        isEqual,
      );
    }

    return orgMember.teams.map((team) => team.team);
  },
);

/**
 * A selector for selecting the currently selected qna and organization.
 */
export const selectQnaAndOrg = createSelector(
  qnaFeature.selectSelectedQna,
  organizationFeature.selectSelectedOrganization,
  (selectedQna, selectedOrganization) => ({
    selectedQna,
    selectedOrganization,
  }),
);

/**
 * A selector for selecting the currently selected qna and screen error.
 */
export const selectQnaAndScreenError = createSelector(
  qnaFeature.selectSelectedQna,
  httpFeature.selectScreenError,
  (selectedQna, screenError) => ({ selectedQna, screenError }),
);

/**
 * A selector for the qna and org states.
 */
export const selectQnaAndOrgStates = createSelector(
  qnaFeature.selectQnaState,
  organizationFeature.selectOrgState,
  (qnaState, orgState) => ({ qnaState, orgState }),
);
