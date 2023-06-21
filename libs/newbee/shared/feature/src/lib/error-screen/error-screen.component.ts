import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { httpFeature } from '@newbee/newbee/shared/data-access';
import {
  ForbiddenErrorComponent,
  InternalServerErrorComponent,
  NotFoundErrorComponent,
} from '@newbee/newbee/shared/ui';
import { HttpClientError } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

/**
 * The smart UI for the error screen, which will display an error if there is one, or the specified content otherwise.
 */
@Component({
  selector: 'newbee-error-screen',
  standalone: true,
  imports: [
    CommonModule,
    ForbiddenErrorComponent,
    InternalServerErrorComponent,
    NotFoundErrorComponent,
  ],
  templateUrl: './error-screen.component.html',
})
export class ErrorScreenComponent implements OnInit, OnDestroy {
  /**
   * Emit to unsubscribe from all infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * Request HTTP error, if any exist.
   */
  httpClientError: HttpClientError | null = null;

  constructor(private readonly store: Store, private readonly router: Router) {}

  /**
   * Subscribe to the HTTP error portion of the store.
   */
  ngOnInit(): void {
    this.store
      .select(httpFeature.selectError)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (error) => {
          this.httpClientError = error;
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

  /**
   * When the dumb UI emits a request to navigate home, pass it to the router.
   */
  async onNavigateHome(): Promise<void> {
    await this.router.navigate(['/']);
  }
}
