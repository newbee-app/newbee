import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MagicLinkLoginLoginFormComponent } from './magic-link-login-login-form.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  declarations: [MagicLinkLoginLoginFormComponent],
  exports: [MagicLinkLoginLoginFormComponent],
})
export class MagicLinkLoginLoginFormModule {}
