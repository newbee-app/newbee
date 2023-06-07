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
  private cleanup!: () => void;

  /**
   * Compute the absolute position for the tooltip and its arrow.
   *
   * @param contentEl
   * @param tooltipEl
   * @param arrowEl
   * @param tooltipPlacement
   */
  private static async recompute(
    contentEl: HTMLDivElement,
    tooltipEl: HTMLDivElement,
    arrowEl: HTMLDivElement,
    tooltipPlacement: Placement
  ): Promise<void> {
    // Compute position of the tooltip text
    const { x, y, placement, middlewareData } = await computePosition(
      contentEl,
      tooltipEl,
      {
        placement: tooltipPlacement,
        middleware: [
          offset(10),
          flip(),
          shift({ padding: 6 }),
          arrow({ element: arrowEl }),
        ],
      }
    );
    Object.assign(tooltipEl.style, {
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
    Object.assign(arrowEl.style, {
      left: arrowX ? `${arrowX}px` : '',
      top: arrowY ? `${arrowY}px` : '',
      [staticSide]: '-4px',
    });
  }

  ngAfterViewInit(): void {
    this.cleanup = autoUpdate(
      this.content.nativeElement,
      this.tooltip.nativeElement,
      () => {
        TooltipComponent.recompute(
          this.content.nativeElement,
          this.tooltip.nativeElement,
          this.arrow.nativeElement,
          this.placement
        );
      }
    );
  }

  ngOnDestroy(): void {
    this.cleanup();
  }
}
