import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { CsrfActions, csrfFeature } from '../store';

export const csrfTokenResolver: ResolveFn<string | null> = () => {
  const store = inject(Store);
  store.dispatch(CsrfActions.getCsrfToken());
  return store.select(csrfFeature.selectCsrfToken);
};
