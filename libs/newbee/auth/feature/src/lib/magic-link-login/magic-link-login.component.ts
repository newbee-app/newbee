import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private readonly route: ActivatedRoute
  ) {}

  /**
   * Make a request to confirm the magic link token.
   */
  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    this.store.dispatch(AuthActions.confirmMagicLink({ token: token ?? '' }));
  }
}
