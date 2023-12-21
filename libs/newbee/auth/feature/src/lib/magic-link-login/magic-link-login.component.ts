import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { Keyword } from '@newbee/shared/util';
import { Store } from '@ngrx/store';

/**
 * The component made for sending a magic link verification request to the backend.
 */
@Component({
  selector: 'newbee-magic-link-login',
  templateUrl: './magic-link-login.component.html',
})
export class MagicLinkLoginComponent {
  /**
   * Make a request to confirm the magic link token.
   */
  constructor(store: Store, route: ActivatedRoute) {
    const token = route.snapshot.paramMap.get(Keyword.MagicLinkLogin);

    // this shouldn't happen, but keep it in for safety
    if (!token) {
      return;
    }

    store.dispatch(AuthActions.confirmMagicLink({ token }));
  }
}
