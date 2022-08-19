import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MagicLinkLoginLoginForm } from '@newbee/newbee/auth/util';

@Component({
  selector: 'newbee-magic-link-login-login-form',
  templateUrl: './magic-link-login-login-form.component.html',
})
export class MagicLinkLoginLoginFormComponent {
  @Input() onSubmit!: (formValues: MagicLinkLoginLoginForm) => void;

  loginForm = this.fb.group({
    email: ['', Validators.required, Validators.email],
  });

  constructor(private readonly fb: FormBuilder) {}

  get email() {
    return this.loginForm.get('email');
  }

  get errorMessage(): string {
    if (this.email?.hasError('required')) {
      return 'You must enter a value';
    } else if (this.email?.hasError('email')) {
      return 'Not a valid email';
    }

    return '';
  }
}
