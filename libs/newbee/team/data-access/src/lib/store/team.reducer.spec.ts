import {
  HttpActions,
  RouterActions,
  TeamActions,
} from '@newbee/newbee/shared/data-access';
import { testTeam1 } from '@newbee/shared/util';
import { initialTeamState, teamFeature, TeamState } from './team.reducer';

describe('TeamReducer', () => {
  const stateAfterCreateTeam: TeamState = {
    ...initialTeamState,
    pendingCreate: true,
  };
  const stateAfterCheckSlug: TeamState = {
    ...initialTeamState,
    pendingCheck: true,
  };

  describe('start from initial state', () => {
    it('should update state for createTeam', () => {
      const updatedState = teamFeature.reducer(
        initialTeamState,
        TeamActions.createTeam
      );
      expect(updatedState).toEqual(stateAfterCreateTeam);
    });

    it('should update state for typingSlug if slug is not empty string, not update if slug is empty', () => {
      let updatedState = teamFeature.reducer(
        initialTeamState,
        TeamActions.typingSlug({ slug: testTeam1.slug })
      );
      expect(updatedState).toEqual(stateAfterCheckSlug);

      updatedState = teamFeature.reducer(
        initialTeamState,
        TeamActions.typingSlug({ slug: '' })
      );
      expect(updatedState).toEqual(initialTeamState);
    });

    it('should update state for checkSlug if slug is not empty string, not update if slug is empty', () => {
      let updatedState = teamFeature.reducer(
        initialTeamState,
        TeamActions.checkSlug({ slug: testTeam1.slug })
      );
      expect(updatedState).toEqual(stateAfterCheckSlug);

      updatedState = teamFeature.reducer(
        initialTeamState,
        TeamActions.checkSlug({ slug: '' })
      );
      expect(updatedState).toEqual(initialTeamState);
    });
  });

  describe('start from altered state', () => {
    it('should update state for checkSlugSuccess', () => {
      const updatedState = teamFeature.reducer(
        stateAfterCheckSlug,
        TeamActions.checkSlugSuccess({ slugTaken: false })
      );
      expect(updatedState).toEqual(initialTeamState);
    });

    it('should update state for generateSlugSuccess', () => {
      const updatedState = teamFeature.reducer(
        stateAfterCheckSlug,
        TeamActions.generateSlugSuccess({ slug: testTeam1.slug })
      );
      expect(updatedState).toEqual({
        ...initialTeamState,
        generatedSlug: testTeam1.slug,
      });
    });

    it('should update state for createTeamSuccess', () => {
      const updatedState = teamFeature.reducer(
        stateAfterCreateTeam,
        TeamActions.createTeamSuccess
      );
      expect(updatedState).toEqual(initialTeamState);
    });

    it('should update state for clientError', () => {
      const updatedState = teamFeature.reducer(
        stateAfterCreateTeam,
        HttpActions.clientError
      );
      expect(updatedState).toEqual(initialTeamState);
    });

    it('should update state for routerRequest', () => {
      const updatedState = teamFeature.reducer(
        stateAfterCreateTeam,
        RouterActions.routerRequest
      );
      expect(updatedState).toEqual(initialTeamState);
    });
  });
});