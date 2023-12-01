import {
  docFeature,
  httpFeature,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import {
  OrgRoleEnum,
  Team,
  addToArrayIfUnique,
  compareOrgRoles,
} from '@newbee/shared/util';
import { createSelector } from '@ngrx/store';

/**
 * A selector for selecting the teams that should be displayed for creating or editing a doc.
 */
export const selectDocTeams = createSelector(
  docFeature.selectSelectedDoc,
  organizationFeature.selectOrgState,
  (selectedDoc, orgState): Team[] => {
    const { selectedOrganization, orgMember } = orgState;
    if (!selectedOrganization || !orgMember) {
      return [];
    } else if (
      compareOrgRoles(orgMember.orgMember.role, OrgRoleEnum.Moderator) >= 0
    ) {
      return selectedOrganization.teams;
    } else if (selectedDoc && selectedDoc.team) {
      const orgMemberTeams = orgMember.teams.map((team) => team.team);
      return addToArrayIfUnique(orgMemberTeams, selectedDoc.team, false);
    }

    return orgMember.teams.map((team) => team.team);
  },
);

/**
 * A selector for selecting the currently selected doc and organization.
 */
export const selectDocAndOrg = createSelector(
  docFeature.selectSelectedDoc,
  organizationFeature.selectSelectedOrganization,
  (selectedDoc, selectedOrganization) => ({
    selectedDoc,
    selectedOrganization,
  }),
);

/**
 * A selector for selecting the currently selected doc and screen error.
 */
export const selectDocAndScreenError = createSelector(
  docFeature.selectSelectedDoc,
  httpFeature.selectScreenError,
  (selectedDoc, screenError) => ({ selectedDoc, screenError }),
);

/**
 * A selector for selecting the currently selected doc and org states.
 */
export const selectDocAndOrgStates = createSelector(
  docFeature.selectDocState,
  organizationFeature.selectOrgState,
  (docState, orgState) => ({ docState, orgState }),
);
