import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthActions } from '@newbee/newbee/auth/data-access';
import { LoginForm } from '@newbee/newbee/auth/util';
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

  onWebAuthn(partialLoginForm: Partial<LoginForm>): void {
    const loginForm = this.partialToLoginForm(partialLoginForm);
    this.store.dispatch(AuthActions.getWebauthnLoginChallenge({ loginForm }));
  }

  onMagicLinkLogin(partialLoginForm: Partial<LoginForm>): void {
    const loginForm = this.partialToLoginForm(partialLoginForm);
    this.store.dispatch(AuthActions.sendLoginMagicLink({ loginForm }));
  }

  async onNavigateToRegister(): Promise<void> {
    await this.router.navigate(['../register'], { relativeTo: this.route });
  }

  private partialToLoginForm(partialLoginForm: Partial<LoginForm>): LoginForm {
    const { email } = partialLoginForm;
    return { email: email ?? '' };
  }
}
