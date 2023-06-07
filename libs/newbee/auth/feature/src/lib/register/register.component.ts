import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { authFeature } from '@newbee/newbee/auth/data-access';
import { RegisterForm } from '@newbee/newbee/auth/util';
import {
  AuthActions,
  HttpActions,
  httpFeature,
} from '@newbee/newbee/shared/data-access';
import { HttpClientError } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

/**
 * The smart UI for registering a new user.
 */
@Component({
  selector: 'newbee-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit, OnDestroy {
  /**
   * Emits to unsubscribe from all infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * Whether a WebAuthn request is pending.
   */
  pendingWebAuthn$ = this.store.select(authFeature.selectPendingWebAuthn);

  /**
   * Request HTTP error, if any exist
   */
  httpClientError: HttpClientError | null = null;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  /**
   * Convert a `Partial<RegisterForm>` to a `RegisterForm`.
   *
   * @param partialRegisterForm The partial to convert.
   * @returns A `RegisterForm` with empty strings where required properties were falsy.
   */
  private static partialToRegisterForm(
    partialRegisterForm: Partial<RegisterForm>
  ): RegisterForm {
    const { email, name } = partialRegisterForm;
    return { ...partialRegisterForm, email: email ?? '', name: name ?? '' };
  }

  /**
   * Reset all pending actions and set `httpClientError` to update whenever the store's error changes.
   */
  ngOnInit(): void {
    this.store.dispatch(AuthActions.resetPendingActions());

    this.store
      .select(httpFeature.selectError)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (error) => {
          if (!error) {
            return;
          }

          this.httpClientError = error;
          this.store.dispatch(HttpActions.resetError());
        },
      });
  }

  /**
   * Unsubscribe from all infinite observables.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * When the dumb UI emits `register`, send a `[Auth] Get WebAuthn Register Challenge` action with the value of the register form.
   *
   * @param partialRegisterForm The register form to feed into the register request.
   */
  onRegister(partialRegisterForm: Partial<RegisterForm>): void {
    const registerForm =
      RegisterComponent.partialToRegisterForm(partialRegisterForm);
    this.store.dispatch(AuthActions.registerWithWebauthn({ registerForm }));
  }

  /**
   * When the dumb UI emits `navigateToLogin`, navigate to the login page.
   */
  async onNavigateToLogin(): Promise<void> {
    await this.router.navigate(['../login'], { relativeTo: this.route });
  }
}
