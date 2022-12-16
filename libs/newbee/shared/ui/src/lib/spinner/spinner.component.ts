import { Component, NgModule } from '@angular/core';

/**
 * A simple component that displays a spinner.
 */
@Component({
  selector: 'newbee-spinner',
  templateUrl: './spinner.component.html',
})
export class SpinnerComponent {}

@NgModule({
  declarations: [SpinnerComponent],
  exports: [SpinnerComponent],
})
export class SpinnerComponentModule {}
