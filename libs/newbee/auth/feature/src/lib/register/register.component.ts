import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthActions } from '@newbee/newbee/auth/data-access';
import { MagicLinkLoginRegisterForm } from '@newbee/newbee/auth/util';
import { Store } from '@ngrx/store';

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

  onRegister(partialFormValues: Partial<MagicLinkLoginRegisterForm>): void {
    const formValues: MagicLinkLoginRegisterForm = {
      ...partialFormValues,
      email: partialFormValues.email ?? '',
      name: partialFormValues.name ?? '',
    };
    this.store.dispatch(AuthActions.sendRegisterMagicLink(formValues));
  }

  onNavigateToLogin(): void {
    this.router.navigate(['../login'], { relativeTo: this.route });
  }
}
