import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MagicLinkLoginLoginFormComponent } from './magic-link-login.login-form.component';

@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [MagicLinkLoginLoginFormComponent],
  exports: [MagicLinkLoginLoginFormComponent],
})
export class MagicLinkLoginLoginFormModule {}
