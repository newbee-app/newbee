import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserActions } from '@newbee/newbee/shared/data-access';
import { Keyword } from '@newbee/shared/util';
import { Store } from '@ngrx/store';

/**
 * The empty smart component for verifying a user's email address.
 */
@Component({
  selector: 'newbee-user-email-verify',
  template: '',
})
export class UserEmailVerifyComponent {
  /**
   * Make a request to verify a user's email.
   */
  constructor(store: Store, route: ActivatedRoute) {
    const token = route.snapshot.paramMap.get(Keyword.Verify);

    // this shouldn't happen, but keep it in for safety
    if (!token) {
      return;
    }

    store.dispatch(UserActions.verifyEmail({ token }));
  }
}
