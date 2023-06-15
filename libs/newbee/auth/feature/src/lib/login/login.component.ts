import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { authFeature } from '@newbee/newbee/auth/data-access';
import { LoginForm, loginFormToDto } from '@newbee/newbee/auth/util';
import {
  AuthActions,
  HttpActions,
  httpFeature,
} from '@newbee/newbee/shared/data-access';
import { HttpClientError } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

/**
 * The smart UI for logging in an existing user.
 */
@Component({
  selector: 'newbee-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  /**
   * Emits to unsubscribe from all infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

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
  httpClientError: HttpClientError | null = null;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

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
   * When the dumb UI emits `webauthn`, send a `[Auth] Get WebAuthn Login Challenge` action with the value of the login form.
   *
   * @param loginForm The login form to feed into the login request.
   */
  onWebAuthn(loginForm: Partial<LoginForm>): void {
    this.store.dispatch(
      AuthActions.createWebauthnLoginOptions({
        emailDto: loginFormToDto(loginForm),
      })
    );
  }

  /**
   * When the dumb UI emits `magicLinkLogin`, send a `[Auth] Send Login Magic Link` action with the value of the login form.
   *
   * @param loginForm The login form to feed into the login request.
   */
  onMagicLinkLogin(loginForm: Partial<LoginForm>): void {
    this.store.dispatch(
      AuthActions.sendLoginMagicLink({ emailDto: loginFormToDto(loginForm) })
    );
  }

  /**
   * When the dumb UI emits `navigateToRegister`, navigate to the register page.
   */
  async onNavigateToRegister(): Promise<void> {
    await this.router.navigate(['../register'], { relativeTo: this.route });
  }
}
