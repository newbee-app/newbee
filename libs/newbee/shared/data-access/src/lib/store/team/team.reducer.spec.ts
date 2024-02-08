import {
  Team,
  testOrgMember1,
  testTeam1,
  testTeamAndMemberDto1,
  testTeamMember1,
  testTeamMember2,
  testTeamMemberRelation1,
  testTeamMemberRelation2,
  testTeamRelation1,
} from '@newbee/shared/util';
import { TeamActions } from './team.actions';
import { TeamState, initialTeamState, teamFeature } from './team.reducer';

describe('TeamReducer', () => {
  const testNewTeam: Team = {
    ...testTeam1,
    name: 'New name',
    slug: 'new-slug',
    upToDateDuration: 'P1Y',
  };

  const stateAfterGetTeamSuccess: TeamState = {
    ...initialTeamState,
    selectedTeam: testTeamRelation1,
    teamMember: testTeamMember1,
  };
  const stateAfterEditTeamSuccess: TeamState = {
    ...stateAfterGetTeamSuccess,
    selectedTeam: {
      ...testTeamRelation1,
      team: testNewTeam,
    },
  };

  describe('from initial state', () => {
    it('should update state for getTeamSuccess', () => {
      const updatedState = teamFeature.reducer(
        initialTeamState,
        TeamActions.getTeamSuccess({
          teamAndMemberDto: testTeamAndMemberDto1,
        }),
      );
      expect(updatedState).toEqual(stateAfterGetTeamSuccess);
    });
  });

  describe('from altered state', () => {
    it('should update state for editTeamSuccess', () => {
      const updatedState = teamFeature.reducer(
        stateAfterGetTeamSuccess,
        TeamActions.editTeamSuccess({
          oldSlug: testTeam1.slug,
          newTeam: testNewTeam,
        }),
      );
      expect(updatedState).toEqual(stateAfterEditTeamSuccess);
    });

    it('should update state for editTeamSlugSuccess', () => {
      const updatedState = teamFeature.reducer(
        stateAfterGetTeamSuccess,
        TeamActions.editTeamSlugSuccess({
          oldSlug: testTeam1.slug,
          newTeam: testNewTeam,
        }),
      );
      expect(updatedState).toEqual(stateAfterEditTeamSuccess);
    });

    it('should update state for addTeamMemberSuccess', () => {
      const updatedState = teamFeature.reducer(
        stateAfterGetTeamSuccess,
        TeamActions.addTeamMemberSuccess({
          teamMember: testTeamMemberRelation1,
        }),
      );
      expect(updatedState).toEqual({
        ...stateAfterGetTeamSuccess,
        selectedTeam: {
          ...testTeamRelation1,
          teamMembers: [
            testTeamMemberRelation1,
            ...testTeamRelation1.teamMembers,
          ],
        },
      });
    });

    it('should update state for editTeamMemberSuccess', () => {
      const updatedState = teamFeature.reducer(
        stateAfterGetTeamSuccess,
        TeamActions.editTeamMemberSuccess({
          orgMemberSlug: testOrgMember1.slug,
          teamMember: testTeamMember2,
        }),
      );
      expect(updatedState).toEqual({
        ...stateAfterGetTeamSuccess,
        selectedTeam: {
          ...testTeamRelation1,
          teamMembers: [
            { ...testTeamMemberRelation1, teamMember: testTeamMember2 },
            testTeamMemberRelation2,
          ],
        },
      });
    });

    it('should update state for deleteTeamMemberSuccess', () => {
      const updatedState = teamFeature.reducer(
        stateAfterGetTeamSuccess,
        TeamActions.deleteTeamMemberSuccess({
          orgMemberSlug: testOrgMember1.slug,
        }),
      );
      expect(updatedState).toEqual({
        ...stateAfterGetTeamSuccess,
        selectedTeam: {
          ...testTeamRelation1,
          teamMembers: [testTeamMemberRelation2],
        },
      });
    });

    it('should update state for editCurrentTeamMember', () => {
      const updatedState = teamFeature.reducer(
        stateAfterGetTeamSuccess,
        TeamActions.editCurrentTeamMember({ teamMember: testTeamMember2 }),
      );
      expect(updatedState).toEqual({
        ...stateAfterGetTeamSuccess,
        teamMember: testTeamMember2,
      });
    });

    it('should update state for deleteTeamSuccess', () => {
      const updatedState = teamFeature.reducer(
        stateAfterGetTeamSuccess,
        TeamActions.deleteTeamSuccess,
      );
      expect(updatedState).toEqual(initialTeamState);
    });

    it('should update state for resetSelectedTeam', () => {
      const updatedState = teamFeature.reducer(
        stateAfterGetTeamSuccess,
        TeamActions.resetSelectedTeam,
      );
      expect(updatedState).toEqual(initialTeamState);
    });
  });
});
