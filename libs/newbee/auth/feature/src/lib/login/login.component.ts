import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { authFeature } from '@newbee/newbee/auth/data-access';
import { AuthActions, httpFeature } from '@newbee/newbee/shared/data-access';
import { BaseEmailDto, Keyword } from '@newbee/shared/util';
import { Store } from '@ngrx/store';

/**
 * The smart UI for logging in an existing user.
 */
@Component({
  selector: 'newbee-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  /**
   * Whether a WebAuthn request is pending.
   */
  pendingWebAuthn$ = this.store.select(authFeature.selectPendingWebAuthn);

  /**
   * Whether a magic link login request is pending.
   */
  pendingMagicLink$ = this.store.select(authFeature.selectPendingMagicLink);

  /**
   * Request HTTP error, if any exist.
   */
  httpClientError$ = this.store.select(httpFeature.selectError);

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  /**
   * When the dumb UI emits `webauthn`, send a `[Auth] Get WebAuthn Login Challenge` action with the value of the login form.
   *
   * @param emailDto The email to feed into the login request.
   */
  onWebAuthn(emailDto: BaseEmailDto): void {
    this.store.dispatch(AuthActions.createWebAuthnLoginOptions({ emailDto }));
  }

  /**
   * When the dumb UI emits `magicLinkLogin`, send a `[Auth] Send Login Magic Link` action with the value of the login form.
   *
   * @param emailDto The email to feed into the login request.
   */
  onMagicLinkLogin(emailDto: BaseEmailDto): void {
    this.store.dispatch(AuthActions.sendLoginMagicLink({ emailDto }));
  }

  /**
   * When the dumb UI emits `navigateToRegister`, navigate to the register page.
   */
  async onNavigateToRegister(): Promise<void> {
    await this.router.navigate([`../${Keyword.Register}`], {
      relativeTo: this.route,
    });
  }
}
