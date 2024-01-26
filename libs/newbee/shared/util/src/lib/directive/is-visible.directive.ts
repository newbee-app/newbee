import { CommonModule, isPlatformServer } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';

/**
 * A directive to be used with some HTML element to tell whether x% of the element is visible to the user.
 */
@Directive({
  selector: '[newbeeIsVisible]',
})
export class IsVisibleDirective implements OnInit, AfterViewInit, OnDestroy {
  /**
   * What percentage of the element should be visible before the callback is emitted.
   * Values should range from [0, 1].
   * 0 means the directive should emit when even 1 pixel is visible, 1 means 100% of the pixels must be visible.
   */
  @Input() threshold: number | number[] = 0;

  /**
   * Indicates that the threshold (or one of the thresholds) has been hit and that portion of the element is visible.
   */
  @Output() visible = new EventEmitter<void>();

  /**
   * The internal intersection observer to use.
   */
  private observer!: IntersectionObserver;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {}

  /**
   * Initialize the internal intersection observer with input values.
   */
  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.visible.emit();
        }
      },
      { threshold: this.threshold },
    );
  }

  /**
   * After the view is initialized, start monitoring the HTML element attached to this directive using the intersection observer.
   */
  ngAfterViewInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.observer.observe(this.elementRef.nativeElement);
  }

  /**
   * Clean up the observer and stop watching all of its targets.
   */
  ngOnDestroy(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.observer.disconnect();
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [IsVisibleDirective],
  exports: [IsVisibleDirective],
})
export class IsVisibleDirectiveModule {}
