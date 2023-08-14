import { OrgRoleEnum, testOrgMemberRelation1 } from '@newbee/shared/util';
import { OrgMemberActions } from './org-member.actions';
import {
  initialOrgMemberState,
  orgMemberFeature,
  OrgMemberState,
} from './org-member.reducer';

describe('OrgMemberReducer', () => {
  const stateAfterGetOrgMemberSuccess: OrgMemberState = {
    ...initialOrgMemberState,
    selectedOrgMember: testOrgMemberRelation1,
  };

  describe('from initial state', () => {
    it('should update state for getOrgMemberSuccess', () => {
      const updatedState = orgMemberFeature.reducer(
        initialOrgMemberState,
        OrgMemberActions.getOrgMemberSuccess({
          orgMember: testOrgMemberRelation1,
        })
      );
      expect(updatedState).toEqual(stateAfterGetOrgMemberSuccess);
    });
  });

  describe('from altered state', () => {
    it('should update state editOrgMemberSuccess', () => {
      const updatedState = orgMemberFeature.reducer(
        stateAfterGetOrgMemberSuccess,
        OrgMemberActions.editOrgMemberSuccess({
          orgMember: { role: OrgRoleEnum.Member, slug: 'newslug' },
        })
      );
      expect(updatedState).toEqual({
        selectedOrgMember: {
          ...testOrgMemberRelation1,
          orgMember: { role: OrgRoleEnum.Member, slug: 'newslug' },
        },
      });
    });

    it('should update state for deleteOrgMemberSuccess', () => {
      const updatedState = orgMemberFeature.reducer(
        stateAfterGetOrgMemberSuccess,
        OrgMemberActions.deleteOrgMemberSuccess
      );
      expect(updatedState).toEqual(initialOrgMemberState);
    });

    it('should update state for resetSelectedOrgMember', () => {
      const updatedState = orgMemberFeature.reducer(
        stateAfterGetOrgMemberSuccess,
        OrgMemberActions.resetSelectedOrgMember
      );
      expect(updatedState).toEqual(initialOrgMemberState);
    });
  });
});
