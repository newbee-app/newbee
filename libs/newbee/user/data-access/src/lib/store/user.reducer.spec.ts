import {
  AuthenticatorActions,
  HttpActions,
  RouterActions,
  UserActions,
} from '@newbee/newbee/shared/data-access';
import { testAuthenticator1 } from '@newbee/shared/util';
import { initialUserState, userFeature, UserState } from './user.reducer';

describe('UserReducer', () => {
  const stateAfterEditUser: UserState = {
    ...initialUserState,
    pendingEdit: true,
  };
  const stateAfterDeleteUser: UserState = {
    ...initialUserState,
    pendingDelete: true,
  };
  const stateAfterGetAuthenticatorsSuccess: UserState = {
    ...initialUserState,
    authenticators: [testAuthenticator1],
    pendingEditAuthenticator: new Map([[testAuthenticator1.id, false]]),
  };
  const stateAfterCreateRegistrationOptions: UserState = {
    ...initialUserState,
    pendingAddAuthenticator: true,
  };

  describe('from initial state', () => {
    it('should update state for editUser', () => {
      const updatedState = userFeature.reducer(
        initialUserState,
        UserActions.editUser
      );
      expect(updatedState).toEqual(stateAfterEditUser);
    });

    it('should update state for deleteUser', () => {
      const updatedState = userFeature.reducer(
        initialUserState,
        UserActions.deleteUser
      );
      expect(updatedState).toEqual(stateAfterDeleteUser);
    });

    it('should update state for getAuthenticatorsSuccess', () => {
      const updatedState = userFeature.reducer(
        initialUserState,
        AuthenticatorActions.getAuthenticatorsSuccess({
          authenticators: [testAuthenticator1],
        })
      );
      expect(updatedState).toEqual(stateAfterGetAuthenticatorsSuccess);
    });

    it('should update state for createRegistrationOptions', () => {
      const updatedState = userFeature.reducer(
        initialUserState,
        AuthenticatorActions.createRegistrationOptions
      );
      expect(updatedState).toEqual(stateAfterCreateRegistrationOptions);
    });
  });

  describe('from altered state', () => {
    it('should update for createAuthenticatorSuccess', () => {
      const updatedState = userFeature.reducer(
        stateAfterCreateRegistrationOptions,
        AuthenticatorActions.createAuthenticatorSuccess({
          authenticator: testAuthenticator1,
        })
      );
      expect(updatedState).toEqual(stateAfterGetAuthenticatorsSuccess);
    });

    it('should update for editUserSuccess', () => {
      let updatedState = userFeature.reducer(
        stateAfterEditUser,
        UserActions.editUserSuccess
      );
      expect(updatedState).toEqual(initialUserState);

      updatedState = userFeature.reducer(
        stateAfterGetAuthenticatorsSuccess,
        UserActions.editUserSuccess
      );
      expect(updatedState).toEqual(stateAfterGetAuthenticatorsSuccess);
    });

    it('should update state for clientError', () => {
      let updatedState = userFeature.reducer(
        stateAfterEditUser,
        HttpActions.clientError
      );
      expect(updatedState).toEqual(initialUserState);

      updatedState = userFeature.reducer(
        stateAfterGetAuthenticatorsSuccess,
        HttpActions.clientError
      );
      expect(updatedState).toEqual(stateAfterGetAuthenticatorsSuccess);
    });

    it('should update state for deleteUserSuccess', () => {
      const updatedState = userFeature.reducer(
        stateAfterEditUser,
        UserActions.deleteUserSuccess
      );
      expect(updatedState).toEqual(initialUserState);
    });

    it('should update state for routerRequest', () => {
      const updatedState = userFeature.reducer(
        stateAfterEditUser,
        RouterActions.routerRequest
      );
      expect(updatedState).toEqual(initialUserState);
    });
  });
});
