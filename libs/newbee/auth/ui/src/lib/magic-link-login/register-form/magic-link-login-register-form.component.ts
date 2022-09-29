import { Component, NgModule } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'newbee-magic-link-login-register-form',
  templateUrl: './magic-link-login-register-form.component.html',
})
export class MagicLinkLoginRegisterFormComponent {
  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    displayName: [''],
    phoneNumber: [''],
  });

  constructor(private readonly fb: FormBuilder) {}
}

@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [MagicLinkLoginRegisterFormComponent],
  exports: [MagicLinkLoginRegisterFormComponent],
})
export class MagicLinkLoginRegisterFormModule {}
