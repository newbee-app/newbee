import { testBaseTeamAndMemberDto1 } from '@newbee/shared/data-access';
import { testTeamMember1, testTeamRelation1 } from '@newbee/shared/util';
import { TeamActions } from './team.actions';
import { initialTeamState, teamFeature, TeamState } from './team.reducer';

describe('TeamReducer', () => {
  const stateAfterGetTeamSuccess: TeamState = {
    ...initialTeamState,
    selectedTeam: testTeamRelation1,
    teamMember: testTeamMember1,
  };

  describe('from initial state', () => {
    it('should update state for getTeamSuccess', () => {
      const updatedState = teamFeature.reducer(
        initialTeamState,
        TeamActions.getTeamSuccess({
          teamAndMemberDto: testBaseTeamAndMemberDto1,
        })
      );
      expect(updatedState).toEqual(stateAfterGetTeamSuccess);
    });
  });

  describe('from altered state', () => {
    const updatedState = teamFeature.reducer(
      stateAfterGetTeamSuccess,
      TeamActions.resetSelectedTeam
    );
    expect(updatedState).toEqual(initialTeamState);
  });
});
