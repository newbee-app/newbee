import { testBaseUserRelationAndOptionsDto1 } from '@newbee/shared/data-access';
import { testUserRelation1 } from '@newbee/shared/util';
import { AuthActions } from './auth.actions';
import { authFeature, AuthState, initialAuthState } from './auth.reducer';

describe('AuthReducer', () => {
  const stateAfterLoginSuccess: AuthState = {
    userRelation: testUserRelation1,
  };

  describe('from initial state', () => {
    it('should not affect state for unknown action', () => {
      const action = { type: 'Unknown' };
      const udpatedState = authFeature.reducer(initialAuthState, action);
      expect(udpatedState).toEqual(initialAuthState);
    });

    it('should update state for registerWithWebauthnSuccess', () => {
      const updatedState = authFeature.reducer(
        initialAuthState,
        AuthActions.registerWithWebauthnSuccess({
          userRelationAndOptionsDto: testBaseUserRelationAndOptionsDto1,
        })
      );
      expect(updatedState).toEqual(stateAfterLoginSuccess);
    });

    it('should update state for loginSuccess', () => {
      const updatedState = authFeature.reducer(
        initialAuthState,
        AuthActions.loginSuccess({ userRelation: testUserRelation1 })
      );
      expect(updatedState).toEqual(stateAfterLoginSuccess);
    });
  });
});
