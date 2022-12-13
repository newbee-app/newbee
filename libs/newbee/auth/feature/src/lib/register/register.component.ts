import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterForm } from '@newbee/newbee/auth/util';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';

/**
 * The smart UI for registering a new user.
 */
@Component({
  selector: 'newbee-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  /**
   * When the dumb UI emits `register`, send a `[Auth] Get WebAuthn Register Challenge` action with the value of the register form.
   *
   * @param partialRegisterForm The register form to feed into the register request.
   */
  onRegister(partialRegisterForm: Partial<RegisterForm>): void {
    const registerForm = this.partialToRegisterForm(partialRegisterForm);
    this.store.dispatch(
      AuthActions.getWebauthnRegisterChallenge({ registerForm })
    );
  }

  /**
   * When the dumb UI emits `navigateToLogin`, navigate to the login page.
   */
  onNavigateToLogin(): void {
    this.router.navigate(['../login'], { relativeTo: this.route });
  }

  /**
   * Convert a `Partial<RegisterForm>` to a `RegisterForm`.
   *
   * @param partialRegisterForm The partial to convert.
   * @returns A `RegisterForm` with empty strings where required properties were falsy.
   */
  private partialToRegisterForm(
    partialRegisterForm: Partial<RegisterForm>
  ): RegisterForm {
    const { email, name } = partialRegisterForm;
    return { ...partialRegisterForm, email: email ?? '', name: name ?? '' };
  }
}
