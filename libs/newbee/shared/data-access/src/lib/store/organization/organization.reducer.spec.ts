import {
  testBaseCsrfTokenAndDataDto1,
  testBaseUserRelationAndOptionsDto1,
} from '@newbee/shared/data-access';
import {
  testOrganization1,
  testOrgMemberInviteRelation1,
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
    selectedOrganization: testOrgMemberRelation1,
    invites: [testOrgMemberInviteRelation1],
  };
  const stateAfterSelectOrg: OrganizationState = {
    ...stateAfterLoginSuccess,
    selectedOrganization: testOrgMemberRelation1,
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
  });

  describe('from login success', () => {
    it('should update state for getAndSelectOrgSuccess', () => {
      const updatedState = organizationFeature.reducer(
        stateAfterLoginSuccess,
        OrganizationActions.getAndSelectOrgSuccess({
          orgMember: testOrgMemberRelation1,
        })
      );
      expect(updatedState).toEqual(stateAfterSelectOrg);
    });
  });
});
