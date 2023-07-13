import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  size,
  type Placement,
} from '@floating-ui/dom';
import { ClickService } from '@newbee/newbee/shared/util';
import { Subject, takeUntil } from 'rxjs';

/**
 * A dumb UI for displaying dropdowns using FloatingUI.
 * Although DaisyUI has its own dropdown, this implementation using FloatingUI is needed to get around very specific obstacles that come form the Daisy version.
 * Notably, the Daisy version cannot have the dropdown layer over its parent div.
 */
@Component({
  selector: 'newbee-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
})
export class DropdownComponent implements OnDestroy, AfterViewInit {
  /**
   * Emit to unsubscribe from all infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * A cleanup function for the floating UI autoUpdate function we set up for the dropdown.
   */
  private cleanup!: () => void;

  /**
   * Which direction the dropdown should go.
   */
  @Input() placement: Placement = 'bottom';

  /**
   * How many px the dropdown should be offset.
   * Defaults to 10.
   */
  @Input() offset = 10;

  /**
   * How the dropdown should behave when the label is clicked.
   * Default is `toggle`, which will toggle it on and off.
   * `expand` will just expand, not shrink.
   */
  @Input() expandStrategy: 'toggle' | 'expand' = 'toggle';

  /**
   * Whether the dropdown is showing or not.
   */
  @Input() expanded = false;

  /**
   * Emits whenever the dropdown is expanded or shrunk.
   */
  @Output() expandedChange = new EventEmitter<boolean>();

  /**
   * The button associated with the content the dropdown should wrap.
   */
  @ViewChild('label') label!: ElementRef<HTMLButtonElement>;

  /**
   * The div associated with the dropdown.
   */
  @ViewChild('dropdown') dropdown!: ElementRef<HTMLDivElement>;

  /**
   * Shrinks the dropdown if the user presses the `esc` key.
   */
  @HostListener('keydown.escape')
  escapeEvent(): void {
    this.shrink();
  }

  /**
   * Subscribe to the user's clicks and shrink the dropdown if the user clicks outside of the dropdown.
   *
   * @param clickService The global click service that shows where the user clicked.
   * @param elementRef The ElementRef for the entire component.
   */
  constructor(clickService: ClickService, elementRef: ElementRef<HTMLElement>) {
    clickService.documentClickTarget
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (target) => {
          if (!elementRef.nativeElement.contains(target)) {
            this.shrink();
          }
        },
      });
  }

  /**
   * Compute the absolute position for the dropdown.
   */
  private async recompute(): Promise<void> {
    const { x, y } = await computePosition(
      this.label.nativeElement,
      this.dropdown.nativeElement,
      {
        placement: this.placement,
        middleware: [
          offset(this.offset),
          flip(),
          shift({ padding: 6 }),
          size({
            apply: ({ rects, elements }) => {
              Object.assign(elements.floating.style, {
                minWidth: `${rects.reference.width}px`,
              });
            },
          }),
        ],
      }
    );
    Object.assign(this.dropdown.nativeElement.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
  }

  /**
   * Assign cleanup and set up floating UI's autoUpdate with the dropdown.
   */
  ngAfterViewInit(): void {
    this.cleanup = autoUpdate(
      this.label.nativeElement,
      this.dropdown.nativeElement,
      () => {
        this.recompute();
      }
    );
  }

  /**
   * Unsubscribe from all infinite observables and clean up floating UI.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    this.cleanup();
  }

  /**
   * Expand the dropdown.
   */
  expand(): void {
    if (!this.expanded) {
      this.expanded = true;
      this.expandedChange.emit(this.expanded);
    }
  }

  /**
   * Shrink the dropdown.
   */
  shrink(): void {
    if (this.expanded) {
      this.expanded = false;
      this.expandedChange.emit(this.expanded);
    }
  }

  /**
   * Toggle whether the dropdown is expanded or not.
   */
  toggleExpand(): void {
    if (this.expanded) {
      this.shrink();
    } else {
      this.expand();
    }
  }

  /**
   * What should happen when the label is clicked.
   */
  labelClick(): void {
    if (this.expandStrategy === 'toggle') {
      this.toggleExpand();
    } else {
      // this.expandStrategy === 'expand'
      this.expand();
    }
  }
}