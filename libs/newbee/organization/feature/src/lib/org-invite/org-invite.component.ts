import { Component } from '@angular/core';
import { organizationFeature as organizationModuleFeature } from '@newbee/newbee/organization/data-access';
import {
  OrganizationActions,
  httpFeature,
  organizationFeature,
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
   * The org member making the request.
   */
  orgMember$ = this.store.select(organizationFeature.selectOrgMember);

  /**
   * The org module state.
   */
  orgModuleState$ = this.store.select(
    organizationModuleFeature.selectOrgModuleState,
  );

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
