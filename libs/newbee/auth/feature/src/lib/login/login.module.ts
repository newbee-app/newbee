import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MagicLinkLoginLoginFormModule } from '@newbee/newbee/auth/ui';
import { LoginComponent } from './login.component';

@NgModule({
  imports: [MagicLinkLoginLoginFormModule, MatListModule],
  declarations: [LoginComponent],
  exports: [LoginComponent],
})
export class LoginModule {}
