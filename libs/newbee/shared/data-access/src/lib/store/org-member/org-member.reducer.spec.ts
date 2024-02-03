import {
  OrgMember,
  OrgRoleEnum,
  testOrgMember1,
  testOrgMemberRelation1,
} from '@newbee/shared/util';
import { OrgMemberActions } from './org-member.actions';
import {
  OrgMemberState,
  initialOrgMemberState,
  orgMemberFeature,
} from './org-member.reducer';

describe('OrgMemberReducer', () => {
  const testNewOrgMember: OrgMember = {
    ...testOrgMember1,
    role: OrgRoleEnum.Member,
    slug: 'newslug',
  };

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
        }),
      );
      expect(updatedState).toEqual(stateAfterGetOrgMemberSuccess);
    });
  });

  describe('from altered state', () => {
    it('should update state editOrgMemberSuccess', () => {
      const updatedState = orgMemberFeature.reducer(
        stateAfterGetOrgMemberSuccess,
        OrgMemberActions.editOrgMemberSuccess({
          orgMember: testNewOrgMember,
        }),
      );
      expect(updatedState).toEqual({
        selectedOrgMember: {
          ...testOrgMemberRelation1,
          orgMember: testNewOrgMember,
        },
      });
    });

    it('should update state for deleteOrgMemberSuccess', () => {
      const updatedState = orgMemberFeature.reducer(
        stateAfterGetOrgMemberSuccess,
        OrgMemberActions.deleteOrgMemberSuccess,
      );
      expect(updatedState).toEqual(initialOrgMemberState);
    });

    it('should update state for resetSelectedOrgMember', () => {
      const updatedState = orgMemberFeature.reducer(
        stateAfterGetOrgMemberSuccess,
        OrgMemberActions.resetSelectedOrgMember,
      );
      expect(updatedState).toEqual(initialOrgMemberState);
    });
  });
});
