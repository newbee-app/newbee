import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { orgMemberFeature } from '@newbee/newbee/org-member/data-access';
import {
  OrgMemberActions,
  httpFeature,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import { BaseCreateOrgMemberInviteDto } from '@newbee/shared/util';
import { Store } from '@ngrx/store';

/**
 * The smart UI for the view org members screen.
 */
@Component({
  selector: 'newbee-org-members-view',
  templateUrl: './org-members-view.component.html',
})
export class OrgMembersViewComponent {
  /**
   * The org member making the request.
   */
  orgState$ = this.store.select(organizationFeature.selectOrgState);

  /**
   * Whether the invite is pending.
   */
  pendingInvite$ = this.store.select(orgMemberFeature.selectPendingInvite);

  /**
   * Request HTTP error, if any exist.
   */
  httpClientError$ = this.store.select(httpFeature.selectError);

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  /**
   * When the dumb UI emits an invite event, dispatch it to the store.
   *
   * @param createOrgMemberInviteDto The values to send to the backend.
   */
  onInvite(createOrgMemberInviteDto: BaseCreateOrgMemberInviteDto): void {
    this.store.dispatch(
      OrgMemberActions.inviteUser({ createOrgMemberInviteDto }),
    );
  }

  /**
   * Navigate to the given path relative to the currently selected org.
   *
   * @param path The path to navigate to.
   */
  async onOrgNavigate(path: string): Promise<void> {
    await this.router.navigate([`../${path}`], { relativeTo: this.route });
  }
}
