import {
  Directive,
  EventEmitter,
  NgModule,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { SlugPipe, SlugPipeModule } from '../pipe';

@Directive({
  selector: '[newbeeSlugInput]',
})
export class SlugInputDirective implements OnInit, OnDestroy {
  /**
   * Emit to unsubscribe from all infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * Emits after the slug input has been formatted.
   */
  @Output() slug = new EventEmitter<string>();

  constructor(
    private readonly control: NgControl,
    private readonly slugPipe: SlugPipe
  ) {}

  /**
   * When the directive starts up, slugify the input if it already has a value.
   * Additionally, slugify the input after the user types with a delay built in.
   */
  ngOnInit(): void {
    if (this.control.control?.value) {
      this.control.control.setValue(
        this.slugPipe.transform(this.control.control.value)
      );
    }

    this.control.control?.valueChanges
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: (value) => {
          const formattedSlug = this.slugPipe.transform(value);
          this.control.control?.setValue(formattedSlug);
          this.slug.emit(formattedSlug);
        },
      });
  }

  /**
   * Unsubscribe from all infinite observables.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

@NgModule({
  imports: [ReactiveFormsModule, SlugPipeModule],
  declarations: [SlugInputDirective],
  exports: [SlugInputDirective],
})
export class SlugInputDirectiveModule {}
