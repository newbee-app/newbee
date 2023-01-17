import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  OnDestroy,
  Output,
} from '@angular/core';
import { ClickService, SelectOption } from '@newbee/newbee/shared/util';
import { Subject, takeUntil } from 'rxjs';

/**
 * A dropdown component.
 */
@Component({
  selector: 'newbee-dropdown',
  templateUrl: './dropdown.component.html',
})
export class DropdownComponent<T> implements OnDestroy {
  /**
   * A subject to unsubscribe from all infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * Whether the dropdown should be displayed.
   */
  private _expanded = false;

  /**
   * What to display on the dropdown.
   */
  @Input() dropdownText!: string;

  /**
   * All of the options to display in the dropdown.
   */
  @Input() options!: SelectOption<T>[];

  /**
   * An emitter that tells the parent component when the user selects an option.
   */
  @Output() selectOption = new EventEmitter<T>();

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
   * Unsubscribes from all infinite observables.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Whether the dropdown should be displayed.
   */
  get expanded(): boolean {
    return this._expanded;
  }

  /**
   * Expand the dropdown, if it's closed.
   */
  expand(): void {
    if (!this._expanded) {
      this._expanded = true;
    }
  }

  /**
   * Shrink the dropdown, if it's open.
   */
  shrink(): void {
    if (this._expanded) {
      this._expanded = false;
    }
  }

  /**
   * Toggle the dropdown.
   */
  toggleExpand(): void {
    if (this._expanded) {
      this.shrink();
    } else {
      this.expand();
    }
  }

  /**
   * Emit the given option and shrink the dropdown.
   * @param option The option to select and emit.
   */
  select(option: SelectOption<T>): void {
    this.selectOption.emit(option.value);
    this.shrink();
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [DropdownComponent],
  exports: [DropdownComponent],
})
export class DropdownComponentModule {}
