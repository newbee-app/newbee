import { Component } from '@angular/core';
import { MagicLinkLoginLoginForm } from '@newbee/newbee/auth/util';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'newbee-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  onSubmit(formValues: MagicLinkLoginLoginForm): void {
    this.store.dispatch(AuthActions.sendMagicLink(formValues));
  }

  constructor(private readonly store: Store) {}
}
