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
   * The `id` attribute for the tooltip's container `div`.
   */
  @Input() containerId?: string;

  /**
   * The `id` attribute for the tooltip's `div`.
   */
  @Input() tooltipId?: string;

  /**
   * The `id` attribute for the tooltip's message's `div`.
   */
  @Input() messageId?: string;

  /**
   * The `id` attribute for the tooltip's tail's `div`.
   */
  @Input() tailId?: string;

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
