import { Component, OnInit } from '@angular/core';
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
export class MagicLinkLoginComponent implements OnInit {
  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRouteSnapshot
  ) {}

  /**
   * Make a request to confirm the magic link token.
   */
  ngOnInit(): void {
    const token = this.route.queryParamMap.get('token');
    this.store.dispatch(AuthActions.confirmMagicLink({ token: token ?? '' }));
  }
}
