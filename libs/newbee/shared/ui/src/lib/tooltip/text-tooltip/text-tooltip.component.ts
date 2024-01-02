import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { type Placement } from '@floating-ui/dom';
import { TooltipComponent } from '../tooltip';

@Component({
  selector: 'newbee-text-tooltip',
  standalone: true,
  imports: [CommonModule, TooltipComponent],
  templateUrl: './text-tooltip.component.html',
})
export class TextTooltipComponent {
  /**
   * The tooltip's text.
   */
  @Input() text = '';

  /**
   * Which direction the tooltip should go.
   */
  @Input() placement!: Placement;

  /**
   * The distance (in px) there should be between the label and the tooltip, defaults to `10`.
   */
  @Input() offset = 10;

  /**
   * Whether to display the tail.
   */
  @Input() includeTail = true;
}
