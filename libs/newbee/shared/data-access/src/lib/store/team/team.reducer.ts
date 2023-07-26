import { Keyword, TeamMember, TeamNoOrg } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';
import { TeamActions } from './team.actions';

/**
 * The piece of state holding team information that's useful app-wide.
 */
export interface TeamState {
  /**
   * The team the user is looking at right now.
   */
  selectedTeam: TeamNoOrg | null;

  /**
   * The user's role in the selected team, if they have any.
   */
  teamMember: TeamMember | null;
}

/**
 * The initial value for `TeamState`.
 */
export const initialTeamState: TeamState = {
  selectedTeam: null,
  teamMember: null,
};

/**
 * The reducers and generated selectors for `TeamState`.
 */
export const teamFeature = createFeature({
  name: Keyword.Team,
  reducer: createReducer(
    initialTeamState,
    on(TeamActions.getTeamSuccess, (state, { teamAndMemberDto }): TeamState => {
      const { team, teamMember } = teamAndMemberDto;
      return {
        ...state,
        selectedTeam: team,
        teamMember,
      };
    }),
    on(TeamActions.resetSelectedTeam, (): TeamState => initialTeamState)
  ),
});
