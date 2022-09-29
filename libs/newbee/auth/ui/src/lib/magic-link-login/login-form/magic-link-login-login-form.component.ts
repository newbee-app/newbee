import { Component, Input, NgModule } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MagicLinkLoginLoginForm } from '@newbee/newbee/auth/util';
import { MagicLinkLoginBaseFormModule } from '../base-form';

@Component({
  selector: 'newbee-magic-link-login-login-form',
  templateUrl: './magic-link-login-login-form.component.html',
})
export class MagicLinkLoginLoginFormComponent {
  @Input() onSubmit!: (formValues: MagicLinkLoginLoginForm) => void;
  @Input() buttonText!: string;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(private readonly fb: FormBuilder) {}

  get email() {
    return this.loginForm.get('email');
  }

  get showErrorMessage(): boolean {
    if (!this.email?.dirty || !this.email?.touched) {
      return false;
    }

    const errors = ['required', 'email'];
    for (const err of errors) {
      if (this.email?.hasError(err)) {
        return true;
      }
    }

    return false;
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

@NgModule({
  imports: [MagicLinkLoginBaseFormModule, ReactiveFormsModule],
  declarations: [MagicLinkLoginLoginFormComponent],
  exports: [MagicLinkLoginLoginFormComponent],
})
export class MagicLinkLoginLoginFormModule {}
