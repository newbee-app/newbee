import {
  HttpActions,
  OrgMemberActions,
  RouterActions,
} from '@newbee/newbee/shared/data-access';
import {
  testPaginatedResultsDocQueryResult1,
  testPaginatedResultsQnaQueryResult1,
  testUser1,
} from '@newbee/shared/util';
import {
  OrgMemberState,
  initialOrgMemberState,
  orgMemberFeature,
} from './org-member.reducer';

describe('OrgMemberReducer', () => {
  const stateAfterEditOrgMember: OrgMemberState = {
    ...initialOrgMemberState,
    pendingEdit: true,
  };
  const stateAfterDeleteOrgMember: OrgMemberState = {
    ...initialOrgMemberState,
    pendingDelete: true,
  };
  const stateAfterGetDocs: OrgMemberState = {
    ...initialOrgMemberState,
    pendingGetDocs: true,
  };
  const stateAfterGetDocsSuccess: OrgMemberState = {
    ...initialOrgMemberState,
    docs: testPaginatedResultsDocQueryResult1,
  };
  const stateAfterGetQnas: OrgMemberState = {
    ...initialOrgMemberState,
    pendingGetQnas: true,
  };
  const stateAfterGetQnasSuccess: OrgMemberState = {
    ...initialOrgMemberState,
    qnas: testPaginatedResultsQnaQueryResult1,
  };
  const stateAfterInviteUser: OrgMemberState = {
    ...initialOrgMemberState,
    pendingInvite: true,
  };

  describe('from initial state', () => {
    it('should update state for editOrgMember', () => {
      const updatedState = orgMemberFeature.reducer(
        initialOrgMemberState,
        OrgMemberActions.editOrgMember,
      );
      expect(updatedState).toEqual(stateAfterEditOrgMember);
    });

    it('should update state for deleteOrgMember', () => {
      const updatedState = orgMemberFeature.reducer(
        initialOrgMemberState,
        OrgMemberActions.deleteOrgMember,
      );
      expect(updatedState).toEqual(stateAfterDeleteOrgMember);
    });

    it('should update state for getDocs', () => {
      let updatedState = orgMemberFeature.reducer(
        initialOrgMemberState,
        OrgMemberActions.getDocs,
      );
      expect(updatedState).toEqual(stateAfterGetDocs);

      updatedState = orgMemberFeature.reducer(
        stateAfterGetDocsSuccess,
        OrgMemberActions.getDocs,
      );
      expect(updatedState).toEqual(stateAfterGetDocsSuccess);
    });

    it('should update state for getQnas', () => {
      let updatedState = orgMemberFeature.reducer(
        initialOrgMemberState,
        OrgMemberActions.getQnas,
      );
      expect(updatedState).toEqual(stateAfterGetQnas);

      updatedState = orgMemberFeature.reducer(
        stateAfterGetQnasSuccess,
        OrgMemberActions.getQnas,
      );
      expect(updatedState).toEqual(stateAfterGetQnasSuccess);
    });

    it('should update state for inviteUser', () => {
      const updatedState = orgMemberFeature.reducer(
        initialOrgMemberState,
        OrgMemberActions.inviteUser,
      );
      expect(updatedState).toEqual(stateAfterInviteUser);
    });
  });

  describe('from altered state', () => {
    it('should update state for editOrgMemberSuccess', () => {
      const updatedState = orgMemberFeature.reducer(
        stateAfterEditOrgMember,
        OrgMemberActions.editOrgMemberSuccess,
      );
      expect(updatedState).toEqual(initialOrgMemberState);
    });

    it('should update state for deleteOrgMemberSuccess', () => {
      const updatedState = orgMemberFeature.reducer(
        stateAfterDeleteOrgMember,
        OrgMemberActions.deleteOrgMemberSuccess,
      );
      expect(updatedState).toEqual(initialOrgMemberState);
    });

    it('should update state for getDocsSuccess', () => {
      let updatedState = orgMemberFeature.reducer(
        stateAfterGetDocs,
        OrgMemberActions.getDocsSuccess({
          docs: testPaginatedResultsDocQueryResult1,
        }),
      );
      expect(updatedState).toEqual({
        ...initialOrgMemberState,
        docs: testPaginatedResultsDocQueryResult1,
      });

      updatedState = orgMemberFeature.reducer(
        stateAfterGetDocsSuccess,
        OrgMemberActions.getDocsSuccess({
          docs: testPaginatedResultsDocQueryResult1,
        }),
      );
      expect(updatedState).toEqual({
        ...stateAfterGetDocsSuccess,
        docs: {
          ...testPaginatedResultsDocQueryResult1,
          results: [
            ...testPaginatedResultsDocQueryResult1.results,
            ...testPaginatedResultsDocQueryResult1.results,
          ],
        },
      });
    });

    it('should update state for getQnasSuccess', () => {
      let updatedState = orgMemberFeature.reducer(
        stateAfterGetQnas,
        OrgMemberActions.getQnasSuccess({
          qnas: testPaginatedResultsQnaQueryResult1,
        }),
      );
      expect(updatedState).toEqual({
        ...initialOrgMemberState,
        qnas: testPaginatedResultsQnaQueryResult1,
      });

      updatedState = orgMemberFeature.reducer(
        stateAfterGetQnasSuccess,
        OrgMemberActions.getQnasSuccess({
          qnas: testPaginatedResultsQnaQueryResult1,
        }),
      );
      expect(updatedState).toEqual({
        ...stateAfterGetQnasSuccess,
        qnas: {
          ...testPaginatedResultsQnaQueryResult1,
          results: [
            ...testPaginatedResultsQnaQueryResult1.results,
            ...testPaginatedResultsQnaQueryResult1.results,
          ],
        },
      });
    });

    it('should update state for inviteUserSuccess', () => {
      const updatedState = orgMemberFeature.reducer(
        stateAfterInviteUser,
        OrgMemberActions.inviteUserSuccess({ email: testUser1.email }),
      );
      expect(updatedState).toEqual(initialOrgMemberState);
    });

    it('should update state for clientError', () => {
      const updatedState = orgMemberFeature.reducer(
        stateAfterEditOrgMember,
        HttpActions.clientError,
      );
      expect(updatedState).toEqual(initialOrgMemberState);
    });

    it('should update state for routerRequest', () => {
      const updatedState = orgMemberFeature.reducer(
        stateAfterEditOrgMember,
        RouterActions.routerRequest,
      );
      expect(updatedState).toEqual(initialOrgMemberState);
    });
  });
});
