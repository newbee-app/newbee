import { UrlEndpoint } from '@newbee/shared/data-access';
import { TeamNoOrg } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';
import { TeamActions } from './team.actions';

/**
 * The piece of state holding team information that's useful app-wide.
 */
export interface TeamState {
  /**
   * The team the user is looking at right now and their relation to it.
   */
  selectedTeam: TeamNoOrg | null;
}

/**
 * The initial value for `TeamState`.
 */
export const initialTeamState: TeamState = {
  selectedTeam: null,
};

/**
 * The reducers and generated selectors for `TeamState`.
 */
export const teamFeature = createFeature({
  name: UrlEndpoint.Team,
  reducer: createReducer(
    initialTeamState,
    on(
      TeamActions.getTeamSuccess,
      (state, { team }): TeamState => ({
        ...state,
        selectedTeam: team,
      })
    ),
    on(TeamActions.resetSelectedTeam, (): TeamState => initialTeamState)
  ),
});
