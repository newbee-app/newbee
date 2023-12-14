import {
  httpFeature,
  organizationFeature,
  teamFeature,
} from '@newbee/newbee/shared/data-access';
import { createSelector } from '@ngrx/store';

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
