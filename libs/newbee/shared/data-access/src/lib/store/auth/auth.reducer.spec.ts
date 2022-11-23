import { testLoginDto1, testUserCreatedDto1 } from '@newbee/shared/data-access';
import { AuthActions } from './auth.actions';
import { authFeature, AuthState, initialAuthState } from './auth.reducer';

describe('AuthReducer', () => {
  const stateAfterLoginSuccess: AuthState = {
    accessToken: testLoginDto1.access_token,
    user: testLoginDto1.user,
  };

  describe('from initial state', () => {
    it('should not affect state for unknown action', () => {
      const action = { type: 'Unknown' };
      const udpatedState = authFeature.reducer(initialAuthState, action);
      expect(udpatedState).toEqual(initialAuthState);
    });

    it('should update state for getWebauthnRegisterChallengeSuccess', () => {
      const updatedState = authFeature.reducer(
        initialAuthState,
        AuthActions.getWebauthnRegisterChallengeSuccess({
          userCreatedDto: testUserCreatedDto1,
        })
      );
      expect(updatedState).toEqual(stateAfterLoginSuccess);
    });

    it('should update state for loginSuccess', () => {
      const updatedState = authFeature.reducer(
        initialAuthState,
        AuthActions.loginSuccess({ loginDto: testLoginDto1 })
      );
      expect(updatedState).toEqual(stateAfterLoginSuccess);
    });
  });
});
