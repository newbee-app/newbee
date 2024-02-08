import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { authFeature } from '@newbee/newbee/auth/data-access';
import { AuthActions, httpFeature } from '@newbee/newbee/shared/data-access';
import { CreateUserDto, Keyword } from '@newbee/shared/util';
import { Store } from '@ngrx/store';

/**
 * The smart UI for registering a new user.
 */
@Component({
  selector: 'newbee-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  /**
   * Whether a WebAuthn request is pending.
   */
  pendingWebAuthn$ = this.store.select(authFeature.selectPendingWebAuthn);

  /**
   * Request HTTP error, if any exist
   */
  httpClientError$ = this.store.select(httpFeature.selectError);

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  /**
   * When the dumb UI emits `register`, send a `[Auth] Get WebAuthn Register Challenge` action with the value of the register form.
   *
   * @param createUserDto The values to feed into the register request.
   */
  onRegister(createUserDto: CreateUserDto): void {
    this.store.dispatch(AuthActions.registerWithWebAuthn({ createUserDto }));
  }

  /**
   * When the dumb UI emits `navigateToLogin`, navigate to the login page.
   */
  async onNavigateToLogin(): Promise<void> {
    await this.router.navigate([`../${Keyword.Login}`], {
      relativeTo: this.route,
    });
  }
}
