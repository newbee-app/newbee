import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MagicLinkLoginLoginFormModule } from '@newbee/newbee/auth/ui';
import { RegisterComponent } from './register.component';

@NgModule({
  imports: [MagicLinkLoginLoginFormModule, MatListModule],
  declarations: [RegisterComponent],
  exports: [RegisterComponent],
})
export class RegisterModule {}
