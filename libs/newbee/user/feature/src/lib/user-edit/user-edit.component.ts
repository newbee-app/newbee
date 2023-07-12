import { Component } from '@angular/core';
import {
  AuthenticatorActions,
  authFeature,
  httpFeature,
  UserActions,
} from '@newbee/newbee/shared/data-access';
import { userFeature } from '@newbee/newbee/user/data-access';
import { EditUserForm, editUserFormToDto } from '@newbee/newbee/user/util';
import { Store } from '@ngrx/store';

/**
 * The smart UI parent for the edit organization screen.
 */
@Component({
  selector: 'newbee-user-edit',
  templateUrl: './user-edit.component.html',
})
export class UserEditComponent {
  /**
   * The current user.
   */
  user$ = this.store.select(authFeature.selectUser);

  /**
   * The user's authenticators.
   */
  authenticators$ = this.store.select(userFeature.selectAuthenticators);

  /**
   * Whether the edit action is pending.
   */
  editPending$ = this.store.select(userFeature.selectPendingEdit);

  /**
   * Whether the add authenticator action is pending.
   */
  addAuthenticatorsPending$ = this.store.select(
    userFeature.selectPendingAddAuthenticator
  );

  /**
   * Whether the edit authenticator action is pending.
   */
  editNamePending$ = this.store.select(
    userFeature.selectPendingEditAuthenticator
  );

  /**
   * Whether the delete action is pending.
   */
  deletePending$ = this.store.select(userFeature.selectPendingDelete);

  /**
   * An HTTP error for the component, if one exists.
   */
  httpClientError$ = this.store.select(httpFeature.selectError);

  constructor(private readonly store: Store) {}

  /**
   * When the dumb UI emits an edit event, send an edit action with the value of the edit form.
   *
   * @param editUserForm The values to send to the backend.
   */
  onEdit(editUserForm: Partial<EditUserForm>): void {
    this.store.dispatch(
      UserActions.editUser({ updateUserDto: editUserFormToDto(editUserForm) })
    );
  }

  /**
   * When the dumb UI emits an add authenticator event, send an add authenticator action.
   */
  onAddAuthenticator(): void {
    this.store.dispatch(AuthenticatorActions.createRegistrationOptions());
  }

  /**
   * When the dumb UI emits a delete event, send a delete action to the store.
   */
  onDelete(): void {
    this.store.dispatch(UserActions.deleteUser());
  }
}
