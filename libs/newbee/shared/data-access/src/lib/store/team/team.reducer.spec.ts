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
  const stateAfterEditTeamSuccess: TeamState = {
    ...stateAfterGetTeamSuccess,
    selectedTeam: {
      ...testTeamRelation1,
      team: { name: 'New name', slug: 'new-slug' },
    },
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
    it('should update state for editTeamSuccess', () => {
      const updatedState = teamFeature.reducer(
        stateAfterGetTeamSuccess,
        TeamActions.editTeamSuccess({
          newTeam: { name: 'New name', slug: 'new-slug' },
        })
      );
      expect(updatedState).toEqual(stateAfterEditTeamSuccess);
    });

    it('should update state for editTeamSlugSuccess', () => {
      const updatedState = teamFeature.reducer(
        stateAfterGetTeamSuccess,
        TeamActions.editTeamSlugSuccess({
          newTeam: { name: 'New name', slug: 'new-slug' },
        })
      );
      expect(updatedState).toEqual(stateAfterEditTeamSuccess);
    });

    it('should update state for deleteTeamSuccess', () => {
      const updatedState = teamFeature.reducer(
        stateAfterGetTeamSuccess,
        TeamActions.deleteTeamSuccess
      );
      expect(updatedState).toEqual(initialTeamState);
    });

    it('should update state for resetSelectedTeam', () => {
      const updatedState = teamFeature.reducer(
        stateAfterGetTeamSuccess,
        TeamActions.resetSelectedTeam
      );
      expect(updatedState).toEqual(initialTeamState);
    });
  });
});
