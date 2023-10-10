import {
  testBaseCsrfTokenAndDataDto1,
  testBaseOrgAndMemberDto1,
  testBaseUserRelationAndOptionsDto1,
} from '@newbee/shared/data-access';
import {
  testOrgMemberRelation1,
  testOrganization1,
  testOrganization2,
  testOrganizationRelation1,
  testOrganizationRelation2,
  testUserRelation1,
} from '@newbee/shared/util';
import { AuthActions } from '../auth';
import { CookieActions } from '../cookie';
import { InviteActions } from '../invite';
import { OrganizationActions } from './organization.actions';
import {
  OrganizationState,
  initialOrganizationState,
  organizationFeature,
} from './organization.reducer';

describe('OrganizationReducer', () => {
  const stateAfterLoginSuccess: OrganizationState = {
    ...initialOrganizationState,
    organizations: [testOrganization1],
  };
  const stateAfterGetOrgSuccess: OrganizationState = {
    ...stateAfterLoginSuccess,
    selectedOrganization: testOrganizationRelation1,
    orgMember: testOrgMemberRelation1,
  };
  const stateAfterEditOrgSuccess: OrganizationState = {
    ...stateAfterGetOrgSuccess,
    organizations: [testOrganization2],
    selectedOrganization: testOrganizationRelation2,
  };
  const stateAfterResetSelectedOrg: OrganizationState = {
    ...stateAfterGetOrgSuccess,
    selectedOrganization: null,
    orgMember: null,
  };

  describe('from initial state', () => {
    it('should update state for registerWithWebAuthnSuccess', () => {
      const updatedState = organizationFeature.reducer(
        initialOrganizationState,
        AuthActions.registerWithWebAuthnSuccess({
          userRelationAndOptionsDto: testBaseUserRelationAndOptionsDto1,
        }),
      );
      expect(updatedState).toEqual(stateAfterLoginSuccess);
    });

    it('should update state for loginSuccess', () => {
      const updatedState = organizationFeature.reducer(
        initialOrganizationState,
        AuthActions.loginSuccess({ userRelation: testUserRelation1 }),
      );
      expect(updatedState).toEqual(stateAfterLoginSuccess);
    });

    it('should update state for initCookiesSuccess', () => {
      const updatedState = organizationFeature.reducer(
        initialOrganizationState,
        CookieActions.initCookiesSuccess({
          csrfTokenAndDataDto: testBaseCsrfTokenAndDataDto1,
        }),
      );
      expect(updatedState).toEqual(stateAfterLoginSuccess);
    });

    it('should update state for createOrgSuccess', () => {
      const updatedState = organizationFeature.reducer(
        initialOrganizationState,
        OrganizationActions.createOrgSuccess({
          organization: testOrganization1,
        }),
      );
      expect(updatedState).toEqual(stateAfterLoginSuccess);
    });

    it('should update state for acceptInviteSuccess', () => {
      const updatedState = organizationFeature.reducer(
        initialOrganizationState,
        InviteActions.acceptInviteSuccess({
          orgMember: testOrgMemberRelation1,
        }),
      );
      expect(updatedState).toEqual(stateAfterLoginSuccess);
    });
  });

  describe('from altered state', () => {
    it('should update state for getOrgSuccess', () => {
      const updatedState = organizationFeature.reducer(
        stateAfterLoginSuccess,
        OrganizationActions.getOrgSuccess({
          orgAndMemberDto: testBaseOrgAndMemberDto1,
        }),
      );
      expect(updatedState).toEqual(stateAfterGetOrgSuccess);
    });

    it('should update state for editOrgSuccess', () => {
      const updatedState = organizationFeature.reducer(
        stateAfterGetOrgSuccess,
        OrganizationActions.editOrgSuccess({
          newOrg: testOrganization2,
        }),
      );
      expect(updatedState).toEqual(stateAfterEditOrgSuccess);
    });

    it('should update state for editOrgSlugSuccess', () => {
      const updatedState = organizationFeature.reducer(
        stateAfterGetOrgSuccess,
        OrganizationActions.editOrgSlugSuccess({
          newOrg: testOrganization2,
        }),
      );
      expect(updatedState).toEqual(stateAfterEditOrgSuccess);
    });

    it('should update state for deleteOrgSuccess', () => {
      const updatedState = organizationFeature.reducer(
        stateAfterGetOrgSuccess,
        OrganizationActions.deleteOrgSuccess(),
      );
      expect(updatedState).toEqual(initialOrganizationState);
    });

    it('should update state for resetSelectedOrg', () => {
      const updatedState = organizationFeature.reducer(
        stateAfterGetOrgSuccess,
        OrganizationActions.resetSelectedOrg(),
      );
      expect(updatedState).toEqual(stateAfterResetSelectedOrg);
    });
  });
});
