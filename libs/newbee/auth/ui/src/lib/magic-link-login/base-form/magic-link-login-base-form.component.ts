import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'newbee-magic-link-login-base-form',
  templateUrl: './magic-link-login-base-form.component.html',
})
export class MagicLinkLoginBaseFormComponent {}

@NgModule({
  declarations: [MagicLinkLoginBaseFormComponent],
  exports: [MagicLinkLoginBaseFormComponent],
})
export class MagicLinkLoginBaseFormModule {}
