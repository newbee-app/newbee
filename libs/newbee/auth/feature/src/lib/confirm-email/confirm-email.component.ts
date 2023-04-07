import { Component, OnDestroy, OnInit } from '@angular/core';
import { authFeature } from '@newbee/newbee/auth/data-access';
import {
  AuthActions,
  HttpActions,
  httpFeature,
} from '@newbee/newbee/shared/data-access';
import { HttpClientError } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

/**
 * The smart UI for users to confirm their magic link email.
 */
@Component({
  selector: 'newbee-confirm-email',
  templateUrl: './confirm-email.component.html',
})
export class ConfirmEmailComponent implements OnInit, OnDestroy {
  /**
   * Emits to unsubscribe from all infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

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
  httpClientError: HttpClientError | null = null;

  constructor(private readonly store: Store) {}

  /**
   * Set `httpClientError` to update whenever the store's error changes.
   */
  ngOnInit(): void {
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
   * When the dumb UI emits `resendLink`, send a `[Auth] Send Login Magic Link` action with the email.
   *
   * @param email The email to resend the link to.
   */
  onResendLink(email: string): void {
    this.store.dispatch(
      AuthActions.sendLoginMagicLink({ loginForm: { email } })
    );
  }
}
