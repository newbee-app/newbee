import { CommonModule } from '@angular/common';
import { Component, NgModule, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { authFeature } from '@newbee/newbee/auth/data-access';
import { JwtIdComponentModule } from '@newbee/newbee/auth/ui';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'newbee-confirm-email',
  templateUrl: './confirm-email.component.html',
})
export class ConfirmEmailComponent implements OnDestroy {
  jwtId!: string;
  email!: string;

  private readonly unsubscribe$ = new Subject<void>();

  constructor(private readonly store: Store, router: Router) {
    store
      .select(authFeature.selectAuthState)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: async ({ jwtId, email }) => {
          if (!jwtId || !email) {
            await router.navigate(['../']);
            return;
          }

          this.jwtId = jwtId;
          this.email = email;
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onResendLink(email: string): void {
    this.store.dispatch(
      AuthActions.sendLoginMagicLink({ loginForm: { email } })
    );
  }
}

@NgModule({
  imports: [CommonModule, JwtIdComponentModule],
  declarations: [ConfirmEmailComponent],
  exports: [ConfirmEmailComponent],
})
export class ConfirmEmailComponentModule {}
