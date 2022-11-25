import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { authFeature } from '@newbee/newbee/auth/data-access';
import { JwtIdComponentModule } from '@newbee/newbee/auth/ui';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'newbee-confirm-email',
  templateUrl: './confirm-email.component.html',
})
export class ConfirmEmailComponent {
  jwtId$ = this.store.select(authFeature.selectJwtId);
  email$ = this.store.select(authFeature.selectEmail);

  constructor(private readonly store: Store) {}

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
