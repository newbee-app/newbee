import {
  AuthenticatorActions,
  HttpActions,
  RouterActions,
  UserActions,
} from '@newbee/newbee/shared/data-access';
import { testAuthenticator1 } from '@newbee/shared/util';
import { UserState, initialUserState, userFeature } from './user.reducer';

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
    pendingEditAuthenticator: new Set(),
    pendingDeleteAuthenticator: new Set(),
  };
  const stateAfterCreateRegistrationOptions: UserState = {
    ...initialUserState,
    pendingAddAuthenticator: true,
  };
  const stateAfterEditAuthenticatorName: UserState = {
    ...stateAfterGetAuthenticatorsSuccess,
    pendingEditAuthenticator: new Set([testAuthenticator1.id]),
  };
  const stateAfterDeleteAuthenticator: UserState = {
    ...stateAfterGetAuthenticatorsSuccess,
    pendingDeleteAuthenticator: new Set([testAuthenticator1.id]),
  };
  const stateAfterSendVerificationEmail: UserState = {
    ...initialUserState,
    pendingSendVerificationEmail: true,
  };

  describe('from initial state', () => {
    it('should update state for editUser', () => {
      const updatedState = userFeature.reducer(
        initialUserState,
        UserActions.editUser,
      );
      expect(updatedState).toEqual(stateAfterEditUser);
    });

    it('should update state for deleteUser', () => {
      const updatedState = userFeature.reducer(
        initialUserState,
        UserActions.deleteUser,
      );
      expect(updatedState).toEqual(stateAfterDeleteUser);
    });

    it('should update state for getAuthenticatorsSuccess', () => {
      const updatedState = userFeature.reducer(
        initialUserState,
        AuthenticatorActions.getAuthenticatorsSuccess({
          authenticators: [testAuthenticator1],
        }),
      );
      expect(updatedState).toEqual(stateAfterGetAuthenticatorsSuccess);
    });

    it('should update state for createRegistrationOptions', () => {
      const updatedState = userFeature.reducer(
        initialUserState,
        AuthenticatorActions.createRegistrationOptions,
      );
      expect(updatedState).toEqual(stateAfterCreateRegistrationOptions);
    });

    it('should update state for sendVerificationEmail', () => {
      const updatedState = userFeature.reducer(
        initialUserState,
        UserActions.sendVerificationEmail,
      );
      expect(updatedState).toEqual(stateAfterSendVerificationEmail);
    });
  });

  describe('from altered state', () => {
    it('should update for createAuthenticatorSuccess', () => {
      const updatedState = userFeature.reducer(
        stateAfterCreateRegistrationOptions,
        AuthenticatorActions.createAuthenticatorSuccess({
          authenticator: testAuthenticator1,
        }),
      );
      expect(updatedState).toEqual(stateAfterGetAuthenticatorsSuccess);
    });

    it('should update for editUserSuccess', () => {
      let updatedState = userFeature.reducer(
        stateAfterEditUser,
        UserActions.editUserSuccess,
      );
      expect(updatedState).toEqual(initialUserState);

      updatedState = userFeature.reducer(
        stateAfterGetAuthenticatorsSuccess,
        UserActions.editUserSuccess,
      );
      expect(updatedState).toEqual(stateAfterGetAuthenticatorsSuccess);
    });

    it('should update state for editAuthenticatorName', () => {
      const updatedState = userFeature.reducer(
        stateAfterGetAuthenticatorsSuccess,
        AuthenticatorActions.editAuthenticatorName({
          id: testAuthenticator1.id,
          name: testAuthenticator1.name,
        }),
      );
      expect(updatedState).toEqual(stateAfterEditAuthenticatorName);
    });

    it('should update state for editAuthenticatorNameSuccess', () => {
      const updatedState = userFeature.reducer(
        stateAfterEditAuthenticatorName,
        AuthenticatorActions.editAuthenticatorNameSuccess({
          authenticator: { ...testAuthenticator1, name: 'new' },
        }),
      );
      expect(updatedState).toEqual({
        ...stateAfterGetAuthenticatorsSuccess,
        authenticators: [{ ...testAuthenticator1, name: 'new' }],
      });
    });

    it('should update state for deleteAuthenticator', () => {
      const updatedState = userFeature.reducer(
        stateAfterGetAuthenticatorsSuccess,
        AuthenticatorActions.deleteAuthenticator({ id: testAuthenticator1.id }),
      );
      expect(updatedState).toEqual(stateAfterDeleteAuthenticator);
    });

    it('should update state for deleteAuthenticatorSuccess', () => {
      const updatedState = userFeature.reducer(
        stateAfterDeleteAuthenticator,
        AuthenticatorActions.deleteAuthenticatorSuccess({
          id: testAuthenticator1.id,
        }),
      );
      expect(updatedState).toEqual({ ...initialUserState, authenticators: [] });
    });

    it('should update state for sendVerificationEmailSuccess', () => {
      const updatedState = userFeature.reducer(
        stateAfterSendVerificationEmail,
        UserActions.sendVerificationEmailSuccess,
      );
      expect(updatedState).toEqual(initialUserState);
    });

    it('should update state for clientError', () => {
      let updatedState = userFeature.reducer(
        stateAfterEditUser,
        HttpActions.clientError,
      );
      expect(updatedState).toEqual(initialUserState);

      updatedState = userFeature.reducer(
        stateAfterGetAuthenticatorsSuccess,
        HttpActions.clientError,
      );
      expect(updatedState).toEqual(stateAfterGetAuthenticatorsSuccess);
    });

    it('should update state for deleteUserSuccess', () => {
      const updatedState = userFeature.reducer(
        stateAfterEditUser,
        UserActions.deleteUserSuccess,
      );
      expect(updatedState).toEqual(initialUserState);
    });

    it('should update state for routerRequest', () => {
      const updatedState = userFeature.reducer(
        stateAfterEditUser,
        RouterActions.routerRequest,
      );
      expect(updatedState).toEqual(initialUserState);
    });
  });
});
