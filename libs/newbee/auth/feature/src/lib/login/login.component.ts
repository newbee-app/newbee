import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginForm } from '@newbee/newbee/auth/util';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'newbee-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  constructor(private readonly store: Store, private readonly router: Router) {}

  onWebAuthn(partialLoginForm: Partial<LoginForm>): void {
    const loginForm = this.partialToLoginForm(partialLoginForm);
    this.store.dispatch(AuthActions.getWebauthnLoginChallenge({ loginForm }));
  }

  onMagicLinkLogin(partialLoginForm: Partial<LoginForm>): void {
    const loginForm = this.partialToLoginForm(partialLoginForm);
    this.store.dispatch(AuthActions.sendLoginMagicLink({ loginForm }));
  }

  async onNavigateToRegister(): Promise<void> {
    await this.router.navigate(['../register']);
  }

  private partialToLoginForm(partialLoginForm: Partial<LoginForm>): LoginForm {
    const { email } = partialLoginForm;
    return { email: email ?? '' };
  }
}
