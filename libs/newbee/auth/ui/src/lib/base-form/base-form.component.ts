import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'newbee-base-form',
  templateUrl: './base-form.component.html',
})
export class BaseFormComponent {}

@NgModule({
  declarations: [BaseFormComponent],
  exports: [BaseFormComponent],
})
export class BaseFormComponentModule {}
