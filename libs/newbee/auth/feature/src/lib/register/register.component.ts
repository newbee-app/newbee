import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterForm } from '@newbee/newbee/auth/util';
import { AuthActions } from '@newbee/newbee/shared/data-access';
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

  onRegister(partialRegisterForm: Partial<RegisterForm>): void {
    const registerForm = this.partialToRegisterForm(partialRegisterForm);
    this.store.dispatch(
      AuthActions.getWebauthnRegisterChallenge({ registerForm })
    );
  }

  onNavigateToLogin(): void {
    this.router.navigate(['../login'], { relativeTo: this.route });
  }

  private partialToRegisterForm(
    partialRegisterForm: Partial<RegisterForm>
  ): RegisterForm {
    const { email, name } = partialRegisterForm;
    return { ...partialRegisterForm, email: email ?? '', name: name ?? '' };
  }
}
