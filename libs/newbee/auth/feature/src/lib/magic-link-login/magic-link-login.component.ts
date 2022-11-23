import { CommonModule } from '@angular/common';
import { Component, NgModule, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthActions,
  selectQueryParams,
} from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'newbee-magic-link-login',
  template: '',
})
export class MagicLinkLoginComponent implements OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();

  constructor(store: Store, router: Router) {
    store
      .select(selectQueryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: async (params) => {
          const token: string | undefined = params['token'];
          if (!token) {
            await router.navigate(['../']);
            return;
          }

          store.dispatch(AuthActions.confirmMagicLink({ token }));
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [MagicLinkLoginComponent],
  exports: [MagicLinkLoginComponent],
})
export class MagicLinkLoginComponentModule {}
