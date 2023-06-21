import {
  testBaseCsrfTokenAndDataDto1,
  testBaseUserRelationAndOptionsDto1,
} from '@newbee/shared/data-access';
import {
  testOrganization1,
  testOrganization2,
  testOrgMemberRelation1,
  testUserRelation1,
} from '@newbee/shared/util';
import { AuthActions } from '../auth';
import { CookieActions } from '../cookie';
import { OrganizationActions } from './organization.actions';
import {
  initialOrganizationState,
  organizationFeature,
  OrganizationState,
} from './organization.reducer';

describe('OrganizationReducer', () => {
  const stateAfterLoginSuccess: OrganizationState = {
    organizations: [testOrganization1],
    selectedOrganization: null,
  };
  const stateAfterGetOrgSuccess: OrganizationState = {
    ...stateAfterLoginSuccess,
    selectedOrganization: testOrgMemberRelation1,
  };
  const stateAfterCreateOrgSuccess: OrganizationState = {
    ...initialOrganizationState,
    organizations: [testOrganization1],
  };
  const stateAfterEditOrgSuccess: OrganizationState = {
    ...stateAfterGetOrgSuccess,
    organizations: [testOrganization2],
    selectedOrganization: {
      ...testOrgMemberRelation1,
      organization: testOrganization2,
    },
  };
  const stateAfterDeleteOrgSuccess: OrganizationState = {
    ...stateAfterGetOrgSuccess,
    organizations: [],
    selectedOrganization: null,
  };
  const stateAfterResetSelectedOrg: OrganizationState = {
    ...stateAfterGetOrgSuccess,
    selectedOrganization: null,
  };

  describe('from initial state', () => {
    it('should update state for registerWithWebauthnSuccess', () => {
      const updatedState = organizationFeature.reducer(
        initialOrganizationState,
        AuthActions.registerWithWebauthnSuccess({
          userRelationAndOptionsDto: testBaseUserRelationAndOptionsDto1,
        })
      );
      expect(updatedState).toEqual(stateAfterLoginSuccess);
    });

    it('should update state for loginSuccess', () => {
      const updatedState = organizationFeature.reducer(
        initialOrganizationState,
        AuthActions.loginSuccess({ userRelation: testUserRelation1 })
      );
      expect(updatedState).toEqual(stateAfterLoginSuccess);
    });

    it('should update state for initCookiesSuccess', () => {
      const updatedState = organizationFeature.reducer(
        initialOrganizationState,
        CookieActions.initCookiesSuccess({
          csrfTokenAndDataDto: testBaseCsrfTokenAndDataDto1,
        })
      );
      expect(updatedState).toEqual(stateAfterLoginSuccess);
    });

    it('should update state for createOrgSuccess', () => {
      const updatedState = organizationFeature.reducer(
        initialOrganizationState,
        OrganizationActions.createOrgSuccess({
          organization: testOrganization1,
        })
      );
      expect(updatedState).toEqual(stateAfterCreateOrgSuccess);
    });
  });

  describe('from login success', () => {
    it('should update state for getOrgSuccess', () => {
      const updatedState = organizationFeature.reducer(
        stateAfterLoginSuccess,
        OrganizationActions.getOrgSuccess({
          orgMember: testOrgMemberRelation1,
        })
      );
      expect(updatedState).toEqual(stateAfterGetOrgSuccess);
    });
  });

  describe('from get org success', () => {
    it('should update state for editOrgSuccess', () => {
      const updatedState = organizationFeature.reducer(
        stateAfterGetOrgSuccess,
        OrganizationActions.editOrgSuccess({
          newOrg: testOrganization2,
        })
      );
      expect(updatedState).toEqual(stateAfterEditOrgSuccess);
    });

    it('should update state for editOrgSlugSuccess', () => {
      const updatedState = organizationFeature.reducer(
        stateAfterGetOrgSuccess,
        OrganizationActions.editOrgSlugSuccess({
          newOrg: testOrganization2,
        })
      );
      expect(updatedState).toEqual(stateAfterEditOrgSuccess);
    });

    it('should update state for deleteOrgSuccess', () => {
      const updatedState = organizationFeature.reducer(
        stateAfterGetOrgSuccess,
        OrganizationActions.deleteOrgSuccess()
      );
      expect(updatedState).toEqual(stateAfterDeleteOrgSuccess);
    });

    it('should update state for resetSelectedOrg', () => {
      const updatedState = organizationFeature.reducer(
        stateAfterGetOrgSuccess,
        OrganizationActions.resetSelectedOrg()
      );
      expect(updatedState).toEqual(stateAfterResetSelectedOrg);
    });
  });
});
