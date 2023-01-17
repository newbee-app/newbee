import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  NgModule,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import {
  RouteKeyword,
  unauthenticatedNavbarRoutes,
} from '@newbee/newbee/navbar/util';
import { ClickService } from '@newbee/newbee/shared/util';
import { Subject, takeUntil } from 'rxjs';

/**
 * The left-hand side of the unauthenticated navbar.
 */
@Component({
  selector: 'newbee-unauthenticated-navigation',
  templateUrl: './unauthenticated-navigation.component.html',
})
export class UnauthenticatedNavigationComponent implements OnDestroy {
  /**
   * Whether the drawer part of the component should be expanded or nto.
   */
  private _expanded = false;

  /**
   * Used to unsubscribe from infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * All possible keywords associated to routes.
   */
  readonly routeKeyword = RouteKeyword;

  /**
   * All of the routes we care about for this component.
   */
  readonly links = unauthenticatedNavbarRoutes;

  /**
   * An `EventEmitter` to tell the parent component which route to navigate to.
   */
  @Output() navigateToLink = new EventEmitter<RouteKeyword>();

  /**
   * The drawer element within the component.
   */
  @ViewChild('drawer') drawer!: ElementRef<HTMLDivElement>;

  /**
   * The expand icon within the component.
   */
  @ViewChild('expandIcon') expandIcon!: ElementRef<HTMLSpanElement>;

  constructor(clickService: ClickService) {
    clickService.documentClickTarget
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (target) => {
          if (
            !this.drawer.nativeElement.contains(target) &&
            !this.expandIcon.nativeElement.contains(target)
          ) {
            this.shrink();
          }
        },
      });
  }

  /**
   * Unsubscribe from infinite observables when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Whether the drawer is expanded.
   */
  get expanded(): boolean {
    return this._expanded;
  }

  /**
   * Call `navigateToLink.emit()` using the given link.
   * @param link The route to emit.
   */
  emitNavigateToLink(link: RouteKeyword): void {
    this.navigateToLink.emit(link);
  }

  /**
   * Expand the drawer.
   */
  expand(): void {
    if (!this._expanded) {
      this._expanded = true;
    }
  }

  /**
   * Shrink the drawer.
   */
  shrink(): void {
    if (this._expanded) {
      this._expanded = false;
    }
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [UnauthenticatedNavigationComponent],
  exports: [UnauthenticatedNavigationComponent],
})
export class UnauthenticatedNavigationComponentModule {}
