import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import type { Placement } from '@floating-ui/dom';
import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';

/**
 * A dumb UI for displaying tooltips using FloatingUI.
 * Although DaisyUI has its own tooltip, this implementation using FloatingUI is needed to get around very specific obstacles that come from the Daisy version.
 * Notably, the Daisy version cannot have the tooltip layer over its parent div.
 */
@Component({
  selector: 'newbee-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
})
export class TooltipComponent implements AfterViewInit, OnDestroy {
  /**
   * The tooltip's text.
   */
  @Input() text!: string;

  /**
   * Which direction the tooltip should go.
   */
  @Input() placement!: Placement;

  /**
   * The div associated with the content the tooltip should wrap.
   */
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;

  /**
   * The div associated with the tooltip text.
   */
  @ViewChild('tooltip') tooltip!: ElementRef<HTMLDivElement>;

  /**
   * The div associated with the tooltip arrow.
   */
  @ViewChild('arrow') arrow!: ElementRef<HTMLDivElement>;

  /**
   * A cleanup function for the FloatingUI autoUpdate function we set up for the tooltip.
   */
  private cleanup: () => void = () => {
    return;
  };

  /**
   * Compute the absolute position for the tooltip and its arrow.
   */
  private async recompute(): Promise<void> {
    // Compute position of the tooltip text
    const { x, y, placement, middlewareData } = await computePosition(
      this.content.nativeElement,
      this.tooltip.nativeElement,
      {
        placement: this.placement,
        middleware: [
          offset(10),
          flip(),
          shift({ padding: 6 }),
          arrow({ element: this.arrow.nativeElement }),
        ],
      }
    );
    Object.assign(this.tooltip.nativeElement.style, {
      left: `${x}px`,
      top: `${y}px`,
    });

    // Compute position of the arrow
    const staticSide = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }[placement.split('-')[0] as string] as string;
    const arrowX = middlewareData.arrow?.x;
    const arrowY = middlewareData.arrow?.y;
    Object.assign(this.arrow.nativeElement.style, {
      left: arrowX ? `${arrowX}px` : '',
      top: arrowY ? `${arrowY}px` : '',
      [staticSide]: '-4px',
    });
  }

  /**
   * Assign cleanup and set up floating UI's autoUpdate with the tooltip.
   */
  ngAfterViewInit(): void {
    this.cleanup = autoUpdate(
      this.content.nativeElement,
      this.tooltip.nativeElement,
      () => {
        this.recompute();
      }
    );
  }

  /**
   * Call cleanup to clean up the floating UI tooltip.
   */
  ngOnDestroy(): void {
    this.cleanup();
  }
}
