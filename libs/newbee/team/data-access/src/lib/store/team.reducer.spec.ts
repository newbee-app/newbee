import {
  HttpActions,
  RouterActions,
  TeamActions,
} from '@newbee/newbee/shared/data-access';
import {
  testCreateTeamMemberDto1,
  testOrgMember1,
  testPaginatedResultsDocSearchResult1,
  testPaginatedResultsQnaSearchResult1,
  testTeam1,
  testUpdateTeamMemberDto1,
} from '@newbee/shared/util';
import { TeamState, initialTeamState, teamFeature } from './team.reducer';

describe('TeamReducer', () => {
  const stateAfterCreateTeam: TeamState = {
    ...initialTeamState,
    pendingCreate: true,
  };
  const stateAfterEditTeam: TeamState = {
    ...initialTeamState,
    pendingEdit: true,
  };
  const stateAfterEditTeamSlug: TeamState = {
    ...initialTeamState,
    pendingEditSlug: true,
  };
  const stateAfterDeleteTeam: TeamState = {
    ...initialTeamState,
    pendingDelete: true,
  };
  const stateAfterCheckSlug: TeamState = {
    ...initialTeamState,
    pendingCheck: true,
  };
  const stateAfterGetDocsPending: TeamState = {
    ...initialTeamState,
    pendingGetDocs: true,
  };
  const stateAfterGetDocsSuccess: TeamState = {
    ...initialTeamState,
    docs: testPaginatedResultsDocSearchResult1,
  };
  const stateAfterGetQnasPending: TeamState = {
    ...initialTeamState,
    pendingGetQnas: true,
  };
  const stateAfterGetQnasSuccess: TeamState = {
    ...initialTeamState,
    qnas: testPaginatedResultsQnaSearchResult1,
  };
  const stateAfterAddTeamMember: TeamState = {
    ...initialTeamState,
    pendingAddTeamMember: true,
  };
  const stateAfterEditTeamMember: TeamState = {
    ...initialTeamState,
    pendingEditTeamMember: new Set([testOrgMember1.slug]),
  };
  const stateAfterDeleteTeamMember: TeamState = {
    ...initialTeamState,
    pendingDeleteTeamMember: new Set([testOrgMember1.slug]),
  };

  describe('from initial state', () => {
    it('should update state for createTeam', () => {
      const updatedState = teamFeature.reducer(
        initialTeamState,
        TeamActions.createTeam,
      );
      expect(updatedState).toEqual(stateAfterCreateTeam);
    });

    it('should update state for editTeam', () => {
      const updatedState = teamFeature.reducer(
        initialTeamState,
        TeamActions.editTeam,
      );
      expect(updatedState).toEqual(stateAfterEditTeam);
    });

    it('should update state for editTeamSlug', () => {
      const updatedState = teamFeature.reducer(
        initialTeamState,
        TeamActions.editTeamSlug,
      );
      expect(updatedState).toEqual(stateAfterEditTeamSlug);
    });

    it('should update state for deleteTeam', () => {
      const updatedState = teamFeature.reducer(
        initialTeamState,
        TeamActions.deleteTeam,
      );
      expect(updatedState).toEqual(stateAfterDeleteTeam);
    });

    it('should update state for typingSlug if slug is not empty string, not update if slug is empty', () => {
      let updatedState = teamFeature.reducer(
        initialTeamState,
        TeamActions.typingSlug({ slug: testTeam1.slug }),
      );
      expect(updatedState).toEqual(stateAfterCheckSlug);

      updatedState = teamFeature.reducer(
        initialTeamState,
        TeamActions.typingSlug({ slug: '' }),
      );
      expect(updatedState).toEqual(initialTeamState);
    });

    it('should update state for checkSlug if slug is not empty string, not update if slug is empty', () => {
      let updatedState = teamFeature.reducer(
        initialTeamState,
        TeamActions.checkSlug({ slug: testTeam1.slug }),
      );
      expect(updatedState).toEqual(stateAfterCheckSlug);

      updatedState = teamFeature.reducer(
        initialTeamState,
        TeamActions.checkSlug({ slug: '' }),
      );
      expect(updatedState).toEqual(initialTeamState);
    });

    it('should update state for getDocsPending', () => {
      const updatedState = teamFeature.reducer(
        initialTeamState,
        TeamActions.getDocsPending,
      );
      expect(updatedState).toEqual(stateAfterGetDocsPending);
    });

    it('should update state for getQnasPending', () => {
      const updatedState = teamFeature.reducer(
        initialTeamState,
        TeamActions.getQnasPending,
      );
      expect(updatedState).toEqual(stateAfterGetQnasPending);
    });

    it('should update state for addTeamMember', () => {
      const updatedState = teamFeature.reducer(
        initialTeamState,
        TeamActions.addTeamMember({
          createTeamMemberDto: testCreateTeamMemberDto1,
        }),
      );
      expect(updatedState).toEqual(stateAfterAddTeamMember);
    });

    it('should update state for editTeamMember', () => {
      const updatedState = teamFeature.reducer(
        initialTeamState,
        TeamActions.editTeamMember({
          orgMemberSlug: testOrgMember1.slug,
          updateTeamMemberDto: testUpdateTeamMemberDto1,
        }),
      );
      expect(updatedState).toEqual(stateAfterEditTeamMember);
    });

    it('should update state for deleteTeamMember', () => {
      const updatedState = teamFeature.reducer(
        initialTeamState,
        TeamActions.deleteTeamMember({ orgMemberSlug: testOrgMember1.slug }),
      );
      expect(updatedState).toEqual(stateAfterDeleteTeamMember);
    });
  });

  describe('from altered state', () => {
    it('should update state for checkSlugSuccess', () => {
      const updatedState = teamFeature.reducer(
        stateAfterCheckSlug,
        TeamActions.checkSlugSuccess({ slugTaken: false }),
      );
      expect(updatedState).toEqual(initialTeamState);
    });

    it('should update state for generateSlugSuccess', () => {
      const updatedState = teamFeature.reducer(
        stateAfterCheckSlug,
        TeamActions.generateSlugSuccess({ slug: testTeam1.slug }),
      );
      expect(updatedState).toEqual({
        ...initialTeamState,
        generatedSlug: testTeam1.slug,
      });
    });

    it('should update state for createTeamSuccess', () => {
      const updatedState = teamFeature.reducer(
        stateAfterCreateTeam,
        TeamActions.createTeamSuccess,
      );
      expect(updatedState).toEqual(initialTeamState);
    });

    it('should update state for editTeamSuccess', () => {
      const updatedState = teamFeature.reducer(
        stateAfterEditTeam,
        TeamActions.editTeamSuccess,
      );
      expect(updatedState).toEqual(initialTeamState);
    });

    it('should update state for editTeamSlugSuccess', () => {
      const updatedState = teamFeature.reducer(
        stateAfterEditTeamSlug,
        TeamActions.editTeamSlugSuccess,
      );
      expect(updatedState).toEqual(initialTeamState);
    });

    it('should update state for deleteTeamSuccess', () => {
      const updatedState = teamFeature.reducer(
        stateAfterDeleteTeam,
        TeamActions.deleteTeamSuccess,
      );
      expect(updatedState).toEqual(initialTeamState);
    });

    it('should update state for getDocsSuccess', () => {
      let updatedState = teamFeature.reducer(
        stateAfterGetDocsPending,
        TeamActions.getDocsSuccess({
          docs: testPaginatedResultsDocSearchResult1,
        }),
      );
      expect(updatedState).toEqual({
        ...initialTeamState,
        docs: testPaginatedResultsDocSearchResult1,
      });

      updatedState = teamFeature.reducer(
        stateAfterGetDocsSuccess,
        TeamActions.getDocsSuccess({
          docs: testPaginatedResultsDocSearchResult1,
        }),
      );
      expect(updatedState).toEqual({
        ...stateAfterGetDocsSuccess,
        docs: {
          ...testPaginatedResultsDocSearchResult1,
          results: [
            ...testPaginatedResultsDocSearchResult1.results,
            ...testPaginatedResultsDocSearchResult1.results,
          ],
        },
      });
    });

    it('should update state for getQnasSuccess', () => {
      let updatedState = teamFeature.reducer(
        stateAfterGetQnasPending,
        TeamActions.getQnasSuccess({
          qnas: testPaginatedResultsQnaSearchResult1,
        }),
      );
      expect(updatedState).toEqual({
        ...initialTeamState,
        qnas: testPaginatedResultsQnaSearchResult1,
      });

      updatedState = teamFeature.reducer(
        stateAfterGetQnasSuccess,
        TeamActions.getQnasSuccess({
          qnas: testPaginatedResultsQnaSearchResult1,
        }),
      );
      expect(updatedState).toEqual({
        ...stateAfterGetQnasSuccess,
        qnas: {
          ...testPaginatedResultsQnaSearchResult1,
          results: [
            ...testPaginatedResultsQnaSearchResult1.results,
            ...testPaginatedResultsQnaSearchResult1.results,
          ],
        },
      });
    });

    it('should update state for addTeamMemberSuccess', () => {
      const updatedState = teamFeature.reducer(
        stateAfterAddTeamMember,
        TeamActions.addTeamMemberSuccess,
      );
      expect(updatedState).toEqual(initialTeamState);
    });

    it('should update state for editTeamMemberSuccess', () => {
      const updatedState = teamFeature.reducer(
        stateAfterEditTeamMember,
        TeamActions.editTeamMemberSuccess,
      );
      expect(updatedState).toEqual(initialTeamState);
    });

    it('should update state for deleteTeamMemberSuccess', () => {
      const updatedState = teamFeature.reducer(
        stateAfterDeleteTeamMember,
        TeamActions.deleteTeamMemberSuccess,
      );
      expect(updatedState).toEqual(initialTeamState);
    });

    it('should update state for clientError', () => {
      const updatedState = teamFeature.reducer(
        stateAfterCreateTeam,
        HttpActions.clientError,
      );
      expect(updatedState).toEqual(initialTeamState);
    });

    it('should update state for routerRequest', () => {
      const updatedState = teamFeature.reducer(
        stateAfterCreateTeam,
        RouterActions.routerRequest,
      );
      expect(updatedState).toEqual(initialTeamState);
    });
  });
});
