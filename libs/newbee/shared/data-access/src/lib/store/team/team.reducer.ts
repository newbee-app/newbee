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
    on(
      TeamActions.editTeamSuccess,
      TeamActions.editTeamSlugSuccess,
      (state, { newTeam }): TeamState => {
        const { selectedTeam } = state;
        if (!selectedTeam) {
          return state;
        }

        return {
          ...state,
          selectedTeam: { ...selectedTeam, team: newTeam },
        };
      },
    ),
    on(TeamActions.addTeamMemberSuccess, (state, { teamMember }): TeamState => {
      const { selectedTeam } = state;
      if (!selectedTeam) {
        return state;
      }

      return {
        ...state,
        selectedTeam: {
          ...selectedTeam,
          teamMembers: [teamMember, ...selectedTeam.teamMembers],
        },
      };
    }),
    on(
      TeamActions.editTeamMemberSuccess,
      (state, { orgMemberSlug, teamMember }): TeamState => {
        const { selectedTeam } = state;
        if (!selectedTeam) {
          return state;
        }

        return {
          ...state,
          selectedTeam: {
            ...selectedTeam,
            teamMembers: selectedTeam.teamMembers.map((tm) =>
              tm.orgMember.slug === orgMemberSlug ? { ...tm, teamMember } : tm,
            ),
          },
        };
      },
    ),
    on(
      TeamActions.deleteTeamMemberSuccess,
      (state, { orgMemberSlug }): TeamState => {
        const { selectedTeam } = state;
        if (!selectedTeam) {
          return state;
        }

        return {
          ...state,
          selectedTeam: {
            ...selectedTeam,
            teamMembers: selectedTeam.teamMembers.filter(
              (teamMember) => teamMember.orgMember.slug !== orgMemberSlug,
            ),
          },
        };
      },
    ),
    on(
      TeamActions.editCurrentTeamMember,
      (state, { teamMember }): TeamState => ({
        ...state,
        teamMember,
      }),
    ),
    on(
      TeamActions.deleteTeamSuccess,
      TeamActions.resetSelectedTeam,
      (): TeamState => initialTeamState,
    ),
  ),
});
