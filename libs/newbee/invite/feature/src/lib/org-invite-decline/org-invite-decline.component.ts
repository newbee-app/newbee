import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InviteActions } from '@newbee/newbee/shared/data-access';
import { Keyword } from '@newbee/shared/util';
import { Store } from '@ngrx/store';

/**
 * The component made for sending a decline invite request to the backend.
 */
@Component({
  selector: 'newbee-org-invite-decline',
  templateUrl: './org-invite-decline.component.html',
})
export class OrgInviteDeclineComponent {
  /**
   * Make a request to decline the invite.
   */
  constructor(store: Store, route: ActivatedRoute) {
    const token = route.snapshot.paramMap.get(Keyword.Invite);

    // this shouldn't happen, but keep it for safety
    if (!token) {
      return;
    }

    store.dispatch(InviteActions.declineInvite({ tokenDto: { token } }));
  }
}
