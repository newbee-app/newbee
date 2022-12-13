import { Component, NgModule } from '@angular/core';

/**
 * An empty component, strictly for use in testing.
 */
@Component({
  selector: 'newbee-empty',
  template: '',
})
export class EmptyComponent {}

@NgModule({
  declarations: [EmptyComponent],
  exports: [EmptyComponent],
})
export class EmptyComponentModule {}
