import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';

/**
 * A component for displaying tooltips.
 */
@Component({
  selector: 'newbee-tooltip',
  templateUrl: './tooltip.component.html',
})
export class TooltipComponent {
  /**
   * The tooltip's message.
   */
  @Input() message!: string;

  /**
   * Whether to display the tooltip.
   */
  @Input() displayTooltip!: boolean;
}

@NgModule({
  imports: [CommonModule],
  declarations: [TooltipComponent],
  exports: [TooltipComponent],
})
export class TooltipComponentModule {}
