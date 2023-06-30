import {
  HttpActions,
  RouterActions,
  UserActions,
} from '@newbee/newbee/shared/data-access';
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
  });

  describe('from altered state', () => {
    it('should update for editUserSuccess', () => {
      const updatedState = userFeature.reducer(
        stateAfterEditUser,
        UserActions.editUserSuccess
      );
      expect(updatedState).toEqual(initialUserState);
    });

    it('should update state for deleteUserSuccess', () => {
      const updatedState = userFeature.reducer(
        stateAfterEditUser,
        UserActions.deleteUserSuccess
      );
      expect(updatedState).toEqual(initialUserState);
    });

    it('should update state for clientError', () => {
      const updatedState = userFeature.reducer(
        stateAfterEditUser,
        HttpActions.clientError
      );
      expect(updatedState).toEqual(initialUserState);
    });

    it('should update state for deleteUserSuccess', () => {
      const updatedState = userFeature.reducer(
        stateAfterEditUser,
        RouterActions.routerRequest
      );
      expect(updatedState).toEqual(initialUserState);
    });
  });
});
