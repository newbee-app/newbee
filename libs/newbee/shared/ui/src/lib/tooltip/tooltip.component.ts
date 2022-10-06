import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';

@Component({
  selector: 'newbee-tooltip',
  templateUrl: './tooltip.component.html',
})
export class TooltipComponent {
  @Input() containerId!: string;
  @Input() tooltipId!: string;
  @Input() messageId!: string;
  @Input() tailId!: string;

  @Input() message!: string;
  @Input() displayTooltip!: boolean;
}

@NgModule({
  imports: [CommonModule],
  declarations: [TooltipComponent],
  exports: [TooltipComponent],
})
export class TooltipModule {}
