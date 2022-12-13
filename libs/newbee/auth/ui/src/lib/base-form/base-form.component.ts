import { Component, NgModule } from '@angular/core';

/**
 * The template to encapsulate the other forms of the module.
 * Is not exported for use outside of the module.
 */
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
