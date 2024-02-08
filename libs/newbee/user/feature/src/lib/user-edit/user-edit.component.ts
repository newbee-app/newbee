import { Component } from '@angular/core';
import {
  AuthenticatorActions,
  authFeature,
  httpFeature,
  UserActions,
} from '@newbee/newbee/shared/data-access';
import { userFeature } from '@newbee/newbee/user/data-access';
import { UpdateUserDto } from '@newbee/shared/util';
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
   * The user module state.
   */
  userModuleState$ = this.store.select(userFeature.selectUserModuleState);

  /**
   * An HTTP error for the component, if one exists.
   */
  httpClientError$ = this.store.select(httpFeature.selectError);

  constructor(private readonly store: Store) {}

  /**
   * When the dumb UI emits an edit event, send an edit action with the value of the edit form.
   *
   * @param updateUserDto The values to send to the backend.
   */
  onEdit(updateUserDto: UpdateUserDto): void {
    this.store.dispatch(UserActions.editUser({ updateUserDto }));
  }

  /**
   * When the dumb UI emits an add authenticator event, send an add authenticator action.
   */
  onAddAuthenticator(): void {
    this.store.dispatch(AuthenticatorActions.createRegistrationOptions());
  }

  /**
   * When the dumb UI emits an edit authenticator event, pass it to the store.
   * @param idAndName The ID of the authenticator to update and a new value for name.
   */
  onEditAuthenticator(idAndName: { id: string; name: string | null }): void {
    this.store.dispatch(AuthenticatorActions.editAuthenticatorName(idAndName));
  }

  /**
   * When the dumb UI emits a delete authenticator event, pass it to the store.
   * @param id The ID of the authenticator to delete.
   */
  onDeleteAuthenticator(id: string): void {
    this.store.dispatch(AuthenticatorActions.deleteAuthenticator({ id }));
  }

  /**
   * When the dumb UI emits a delete event, send a delete action to the store.
   */
  onDelete(): void {
    this.store.dispatch(UserActions.deleteUser());
  }

  /**
   * When the dumb UI emits a send verification email event, send the event to the store.
   */
  onSendVerificationEmail(): void {
    this.store.dispatch(UserActions.sendVerificationEmail());
  }
}
