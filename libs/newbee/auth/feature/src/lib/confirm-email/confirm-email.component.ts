import { Component } from '@angular/core';
import { authFeature } from '@newbee/newbee/auth/data-access';
import { AuthActions, httpFeature } from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';

/**
 * The smart UI for users to confirm their magic link email.
 */
@Component({
  selector: 'newbee-confirm-email',
  templateUrl: './confirm-email.component.html',
})
export class ConfirmEmailComponent {
  /**
   * The JWT ID associated with the magic link.
   */
  jwtId$ = this.store.select(authFeature.selectJwtId);

  /**
   * The email the magic link was sent to.
   */
  email$ = this.store.select(authFeature.selectEmail);

  /**
   * Request HTTP error, if any exist.
   */
  httpClientError$ = this.store.select(httpFeature.selectError);

  constructor(private readonly store: Store) {}

  /**
   * When the dumb UI emits `resendLink`, send a `[Auth] Send Login Magic Link` action with the email.
   *
   * @param email The email to resend the link to.
   */
  onResendLink(email: string): void {
    this.store.dispatch(
      AuthActions.sendLoginMagicLink({ emailDto: { email } })
    );
  }
}
