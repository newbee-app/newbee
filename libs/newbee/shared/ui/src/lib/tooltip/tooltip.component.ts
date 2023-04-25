import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

/**
 * A component for displaying tooltips.
 */
@Component({
  selector: 'newbee-tooltip',
  standalone: true,
  imports: [CommonModule],
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
