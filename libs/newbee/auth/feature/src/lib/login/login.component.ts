import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthActions } from '@newbee/newbee/auth/data-access';
import { MagicLinkLoginLoginForm } from '@newbee/newbee/auth/util';
import { Store } from '@ngrx/store';

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

  onLogin(partialFormValues: Partial<MagicLinkLoginLoginForm>): void {
    const formValues: MagicLinkLoginLoginForm = {
      email: partialFormValues.email ?? '',
    };
    this.store.dispatch(AuthActions.sendLoginMagicLink(formValues));
  }

  onNavigateToRegister(): void {
    this.router.navigate(['../register'], { relativeTo: this.route });
  }
}
