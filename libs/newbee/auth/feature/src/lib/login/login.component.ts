import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { authFeature } from '@newbee/newbee/auth/data-access';
import { LoginForm, loginFormToDto } from '@newbee/newbee/auth/util';
import { AuthActions, httpFeature } from '@newbee/newbee/shared/data-access';
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
   * @param loginForm The login form to feed into the login request.
   */
  onWebAuthn(loginForm: Partial<LoginForm>): void {
    this.store.dispatch(
      AuthActions.createWebAuthnLoginOptions({
        emailDto: loginFormToDto(loginForm),
      }),
    );
  }

  /**
   * When the dumb UI emits `magicLinkLogin`, send a `[Auth] Send Login Magic Link` action with the value of the login form.
   *
   * @param loginForm The login form to feed into the login request.
   */
  onMagicLinkLogin(loginForm: Partial<LoginForm>): void {
    this.store.dispatch(
      AuthActions.sendLoginMagicLink({ emailDto: loginFormToDto(loginForm) }),
    );
  }

  /**
   * When the dumb UI emits `navigateToRegister`, navigate to the register page.
   */
  async onNavigateToRegister(): Promise<void> {
    await this.router.navigate(['../register'], { relativeTo: this.route });
  }
}
