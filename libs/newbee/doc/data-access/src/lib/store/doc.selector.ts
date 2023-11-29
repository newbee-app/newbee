import {
  docFeature,
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
