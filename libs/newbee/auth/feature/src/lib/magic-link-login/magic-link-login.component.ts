import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';

/**
 * The empty component made for sending a magic link verification request to the backend.
 */
@Component({
  selector: 'newbee-magic-link-login',
  template: '',
})
export class MagicLinkLoginComponent {
  constructor(store: Store, route: ActivatedRouteSnapshot) {
    const token = route.queryParamMap.get('token') as string;
    store.dispatch(AuthActions.confirmMagicLink({ token }));
  }
}
