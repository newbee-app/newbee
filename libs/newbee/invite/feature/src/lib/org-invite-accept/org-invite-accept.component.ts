import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InviteActions } from '@newbee/newbee/shared/data-access';
import { Keyword } from '@newbee/shared/util';
import { Store } from '@ngrx/store';

/**
 * The component made for sending an accept invite request to the backend.
 */
@Component({
  selector: 'newbee-org-invite-accept',
  templateUrl: './org-invite-accept.component.html',
})
export class OrgInviteAcceptComponent {
  /**
   * Make a request to accept the invite.
   */
  constructor(store: Store, route: ActivatedRoute) {
    const token = route.snapshot.paramMap.get(Keyword.Invite);

    // this shouldn't happen, but keep it in for safety
    if (!token) {
      return;
    }

    store.dispatch(InviteActions.acceptInvite({ tokenDto: { token } }));
  }
}
