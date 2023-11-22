import { Component } from '@angular/core';
import { organizationFeature } from '@newbee/newbee/organization/data-access';
import {
  OrganizationActions,
  httpFeature,
} from '@newbee/newbee/shared/data-access';
import { BaseCreateOrgMemberInviteDto } from '@newbee/shared/util';
import { Store } from '@ngrx/store';

/**
 * The smart UI for the invite member screen.
 */
@Component({
  selector: 'newbee-org-invite',
  templateUrl: './org-invite.component.html',
})
export class OrgInviteComponent {
  /**
   * Whether the invite action is pending.
   */
  invitePending$ = this.store.select(organizationFeature.selectPendingInvite);

  /**
   * The email of the invited user, if an invitation was successfully sent.
   */
  invitedUser$ = this.store.select(organizationFeature.selectInvitedUser);

  /**
   * Request HTTP error, if any exist.
   */
  httpClientError$ = this.store.select(httpFeature.selectError);

  constructor(private readonly store: Store) {}

  /**
   * When the dumb UI emits an invite event, dispatch it to the store.
   *
   * @param createOrgMemberInviteDto The values to send to the backend.
   */
  onInvite(createOrgMemberInviteDto: BaseCreateOrgMemberInviteDto): void {
    this.store.dispatch(
      OrganizationActions.inviteUser({ createOrgMemberInviteDto }),
    );
  }
}
