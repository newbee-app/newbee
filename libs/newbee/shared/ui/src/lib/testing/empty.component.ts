import { Component, NgModule } from '@angular/core';

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
