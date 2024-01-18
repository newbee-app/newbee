import {
  httpFeature,
  organizationFeature,
  teamFeature,
} from '@newbee/newbee/shared/data-access';
import { OrgMemberUser } from '@newbee/shared/util';
import { createSelector } from '@ngrx/store';
import { teamFeature as teamModuleFeature } from './team.reducer';

/**
 * A selector for selecting the currently selected team and organization.
 */
export const selectTeamAndOrg = createSelector(
  teamFeature.selectSelectedTeam,
  organizationFeature.selectSelectedOrganization,
  (selectedTeam, selectedOrganization) => ({
    selectedTeam,
    selectedOrganization,
  }),
);

/**
 * A selector for selecting the currently selected team and screen error.
 */
export const selectTeamAndScreenError = createSelector(
  teamFeature.selectSelectedTeam,
  httpFeature.selectScreenError,
  (selectedTeam, screenError) => ({
    selectedTeam,
    screenError,
  }),
);

/**
 * A selector for selecting the team and org states.
 */
export const selectTeamAndOrgStates = createSelector(
  teamFeature.selectTeamState,
  organizationFeature.selectOrgState,
  (teamState, orgState) => ({ teamState, orgState }),
);

/**
 * A selector for selecting all of the org members in the currently selected org who are not team members of the currently selected team.
 */
export const selectNonTeamOrgMembers = createSelector(
  teamFeature.selectSelectedTeam,
  organizationFeature.selectSelectedOrganization,
  (selectedTeam, selectedOrganization): OrgMemberUser[] => {
    if (!selectedOrganization || !selectedTeam) {
      return [];
    }

    const orgMembersInTeam = new Set(
      selectedTeam.teamMembers.map((teamMember) => teamMember.orgMember.slug),
    );
    return selectedOrganization.members.filter(
      (orgMember) => !orgMembersInTeam.has(orgMember.orgMember.slug),
    );
  },
);

/**
 * A selector for selecting the team's posts, currently selected team, and currently selected org.
 */
export const selectTeamPostsAndOrg = createSelector(
  teamModuleFeature.selectDocs,
  teamModuleFeature.selectQnas,
  teamFeature.selectSelectedTeam,
  organizationFeature.selectSelectedOrganization,
  (docs, qnas, selectedTeam, selectedOrganization) => ({
    docs,
    qnas,
    selectedTeam,
    selectedOrganization,
  }),
);
