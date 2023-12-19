import { DomPortal } from '@angular/cdk/portal';
import { CommonModule, isPlatformServer } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
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
import { PortalService } from '@newbee/newbee/shared/util';

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
   * Whether the tooltip should be portalled to the app component.
   */
  @Input() portal = true;

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
   * A cleanup function for the FloatingUI autoUpdate function we set up for the tooltip, which can be null on the server-side.
   */
  private cleanup: (() => void) | null = null;

  /**
   * A unique ID associated with this tooltip, for use with the PortalService.
   */
  private id = '';

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly ngZone: NgZone,
    private readonly portalService: PortalService,
  ) {}

  /**
   * Compute the absolute position for the tooltip and its arrow.
   */
  private recompute(): void {
    this.ngZone.runOutsideAngular(async () => {
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
        },
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
    });
  }

  /**
   * Assign cleanup and set up floating UI's autoUpdate with the tooltip.
   */
  ngAfterViewInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.cleanup = autoUpdate(
        this.content.nativeElement,
        this.tooltip.nativeElement,
        () => {
          this.recompute();
        },
      );
    });

    if (this.portal) {
      this.id = this.portalService.addPortal(new DomPortal(this.tooltip));
    }
  }

  /**
   * Delete the portal associated with the tooltip and clean up the floating UI tooltip.
   */
  ngOnDestroy(): void {
    if (this.portal) {
      this.portalService.deletePortal(this.id);
    }

    this.cleanup?.();
  }
}
