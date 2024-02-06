import {
  testBaseCsrfTokenAndDataDto1,
  testBaseUserRelationAndOptionsDto1,
  testOrgMemberInviteRelation1,
  testUser1,
  testUser2,
  testUserRelation1,
} from '@newbee/shared/util';
import { CookieActions } from '../cookie';
import { UserActions } from '../user';
import { AuthActions } from './auth.actions';
import { AuthState, authFeature, initialAuthState } from './auth.reducer';

describe('AuthReducer', () => {
  const stateAfterLoginSuccess: AuthState = {
    user: testUser1,
    invites: [testOrgMemberInviteRelation1],
  };

  describe('from initial state', () => {
    it('should not affect state for unknown action', () => {
      const action = { type: 'Unknown' };
      const udpatedState = authFeature.reducer(initialAuthState, action);
      expect(udpatedState).toEqual(initialAuthState);
    });

    it('should update state for registerWithWebAuthnSuccess', () => {
      const updatedState = authFeature.reducer(
        initialAuthState,
        AuthActions.registerWithWebAuthnSuccess({
          userRelationAndOptionsDto: testBaseUserRelationAndOptionsDto1,
        }),
      );
      expect(updatedState).toEqual(stateAfterLoginSuccess);
    });

    it('should update state for loginSuccess', () => {
      const updatedState = authFeature.reducer(
        initialAuthState,
        AuthActions.loginSuccess({ userRelation: testUserRelation1 }),
      );
      expect(updatedState).toEqual(stateAfterLoginSuccess);
    });

    it('should update state for initCookiesSuccess', () => {
      const updatedState = authFeature.reducer(
        initialAuthState,
        CookieActions.initCookiesSuccess({
          csrfTokenAndDataDto: testBaseCsrfTokenAndDataDto1,
        }),
      );
      expect(updatedState).toEqual(stateAfterLoginSuccess);
    });
  });

  describe('from login success', () => {
    it('should update state for editUserSuccess', () => {
      const updatedState = authFeature.reducer(
        stateAfterLoginSuccess,
        UserActions.editUserSuccess({ user: testUser2 }),
      );
      expect(updatedState).toEqual({
        ...stateAfterLoginSuccess,
        user: testUser2,
      });
    });

    it('should update state for verifyEmailSuccess', () => {
      let updatedState = authFeature.reducer(
        { ...initialAuthState, user: testUser2 },
        UserActions.verifyEmailSuccess({
          user: { ...testUser2, emailVerified: true },
        }),
      );
      expect(updatedState).toEqual({
        ...initialAuthState,
        user: { ...testUser2, emailVerified: true },
      });

      updatedState = authFeature.reducer(
        stateAfterLoginSuccess,
        UserActions.verifyEmailSuccess({ user: testUser2 }),
      );
      expect(updatedState).toEqual(stateAfterLoginSuccess);
    });

    it('should update state for logoutSuccess', () => {
      const updatedState = authFeature.reducer(
        stateAfterLoginSuccess,
        AuthActions.logoutSuccess(),
      );
      expect(updatedState).toEqual(initialAuthState);
    });

    it('should update state for deleteUSerSuccess', () => {
      const updatedState = authFeature.reducer(
        stateAfterLoginSuccess,
        UserActions.deleteUserSuccess,
      );
      expect(updatedState).toEqual(initialAuthState);
    });
  });
});
