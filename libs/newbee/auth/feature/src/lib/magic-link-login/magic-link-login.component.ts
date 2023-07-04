import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { magicLinkLogin } from '@newbee/shared/util';
import { Store } from '@ngrx/store';

/**
 * The empty component made for sending a magic link verification request to the backend.
 */
@Component({
  selector: 'newbee-magic-link-login',
  templateUrl: './magic-link-login.component.html',
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
    const token = this.route.snapshot.paramMap.get(magicLinkLogin);
    this.store.dispatch(AuthActions.confirmMagicLink({ token: token ?? '' }));
  }
}
