import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginForm } from '@newbee/newbee/auth/util';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';

/**
 * The smart UI for logging in an existing user.
 */
@Component({
  selector: 'newbee-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  /**
   * When the dumb UI emits `webauthn`, send a `[Auth] Get WebAuthn Login Challenge` action with the value of the login form.
   *
   * @param partialLoginForm The login form to feed into the login request.
   */
  onWebAuthn(partialLoginForm: Partial<LoginForm>): void {
    const loginForm = this.partialToLoginForm(partialLoginForm);
    this.store.dispatch(AuthActions.getWebauthnLoginChallenge({ loginForm }));
  }

  /**
   * When the dumb UI emits `magicLinkLogin`, send a `[Auth] Send Login Magic Link` action with the value of the login form.
   *
   * @param partialLoginForm The login form to feed into the login request.
   */
  onMagicLinkLogin(partialLoginForm: Partial<LoginForm>): void {
    const loginForm = this.partialToLoginForm(partialLoginForm);
    this.store.dispatch(AuthActions.sendLoginMagicLink({ loginForm }));
  }

  /**
   * When the dumb UI emits `navigateToRegister`, navigate to the register page.
   */
  async onNavigateToRegister(): Promise<void> {
    await this.router.navigate(['../register'], { relativeTo: this.route });
  }

  /**
   * Converts a `Partial<LoginForm>` to a `LoginForm`.
   *
   * @param partialLoginForm The partial to convert.
   * @returns A `LoginForm` with empty strings where required properties were falsy.
   */
  private partialToLoginForm(partialLoginForm: Partial<LoginForm>): LoginForm {
    const { email } = partialLoginForm;
    return { email: email ?? '' };
  }
}
