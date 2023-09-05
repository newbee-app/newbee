import { Component, OnInit } from '@angular/core';
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
export class OrgInviteAcceptComponent implements OnInit {
  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute
  ) {}

  /**
   * Make a request to accept the invite.
   */
  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get(Keyword.Invite);

    // this shouldn't happen, but keep it in for safety
    if (!token) {
      return;
    }

    this.store.dispatch(InviteActions.acceptInvite({ tokenDto: { token } }));
  }
}
