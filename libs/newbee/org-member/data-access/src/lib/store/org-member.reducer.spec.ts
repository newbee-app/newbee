import {
  HttpActions,
  OrgMemberActions,
  RouterActions,
} from '@newbee/newbee/shared/data-access';
import {
  initialOrgMemberState,
  orgMemberFeature,
  OrgMemberState,
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

  describe('from initial state', () => {
    it('should update state for editOrgMember', () => {
      const updatedState = orgMemberFeature.reducer(
        initialOrgMemberState,
        OrgMemberActions.editOrgMember
      );
      expect(updatedState).toEqual(stateAfterEditOrgMember);
    });

    it('should update state for deleteOrgMember', () => {
      const updatedState = orgMemberFeature.reducer(
        initialOrgMemberState,
        OrgMemberActions.deleteOrgMember
      );
      expect(updatedState).toEqual(stateAfterDeleteOrgMember);
    });
  });

  describe('from altered state', () => {
    it('should update state for editOrgMemberSuccess', () => {
      const updatedState = orgMemberFeature.reducer(
        stateAfterEditOrgMember,
        OrgMemberActions.editOrgMemberSuccess
      );
      expect(updatedState).toEqual(initialOrgMemberState);
    });

    it('should update state for deleteOrgMemberSuccess', () => {
      const updatedState = orgMemberFeature.reducer(
        stateAfterDeleteOrgMember,
        OrgMemberActions.deleteOrgMemberSuccess
      );
      expect(updatedState).toEqual(initialOrgMemberState);
    });

    it('should update state for clientError', () => {
      const updatedState = orgMemberFeature.reducer(
        stateAfterEditOrgMember,
        HttpActions.clientError
      );
      expect(updatedState).toEqual(initialOrgMemberState);
    });

    it('should update state for routerRequest', () => {
      const updatedState = orgMemberFeature.reducer(
        stateAfterEditOrgMember,
        RouterActions.routerRequest
      );
      expect(updatedState).toEqual(initialOrgMemberState);
    });
  });
});
