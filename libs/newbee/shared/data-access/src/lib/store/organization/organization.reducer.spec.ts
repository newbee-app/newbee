import {
  testBaseCsrfTokenAndDataDto1,
  testBaseUserRelationAndOptionsDto1,
} from '@newbee/shared/data-access';
import {
  testOrganization1,
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
  const stateAfterGetOrg: OrganizationState = {
    ...stateAfterLoginSuccess,
    selectedOrganization: testOrgMemberRelation1,
  };
  const stateAfterCreateOrg: OrganizationState = {
    ...initialOrganizationState,
    organizations: [testOrganization1],
  };
  const stateAfterResetSelectedOrg: OrganizationState = {
    ...stateAfterGetOrg,
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
      expect(updatedState).toEqual(stateAfterCreateOrg);
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
      expect(updatedState).toEqual(stateAfterGetOrg);
    });
  });

  describe('from get org success', () => {
    it('should update state for resetSelectedOrg', () => {
      const updatedState = organizationFeature.reducer(
        stateAfterGetOrg,
        OrganizationActions.resetSelectedOrg()
      );
      expect(updatedState).toEqual(stateAfterResetSelectedOrg);
    });

    it('should update state for orgCreateComponentInit', () => {
      const updatedState = organizationFeature.reducer(
        stateAfterGetOrg,
        OrganizationActions.orgCreateComponentInit()
      );
      expect(updatedState).toEqual(stateAfterResetSelectedOrg);
    });
  });
});
