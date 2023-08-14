import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { orgMemberFeature as orgMemberModuleFeature } from '@newbee/newbee/org-member/data-access';
import {
  organizationFeature,
  OrgMemberActions,
  orgMemberFeature,
} from '@newbee/newbee/shared/data-access';
import { OrgRoleEnum } from '@newbee/shared/util';
import { Store } from '@ngrx/store';

/**
 * The smart UI for the view org member screen.
 */
@Component({
  selector: 'newbee-org-member-view',
  templateUrl: './org-member-view.component.html',
})
export class OrgMemberViewComponent {
  /**
   * The org member we're looking at.
   */
  orgMember$ = this.store.select(orgMemberFeature.selectSelectedOrgMember);

  /**
   * The org member information of the user who's looking at the page.
   */
  userOrgMember$ = this.store.select(organizationFeature.selectOrgMember);

  /**
   * Whether the edit org role action is pending.
   */
  editPending$ = this.store.select(orgMemberModuleFeature.selectPendingEdit);

  /**
   * Whether the delete action is pending.
   */
  deletePending$ = this.store.select(
    orgMemberModuleFeature.selectPendingDelete
  );

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  /**
   * Navigate to a path relative to the current org.
   *
   * @param path The path to navigate to.
   */
  async onOrgNavigate(path: string): Promise<void> {
    await this.router.navigate([`../../${path}`], { relativeTo: this.route });
  }

  /**
   * Navigate to a path relative to the current org member.
   *
   * @param path The path to navigate to.
   */
  async onMemberNavigate(path: string): Promise<void> {
    await this.router.navigate([`./${path}`], { relativeTo: this.route });
  }

  /**
   * Edit the role of the current org member.
   *
   * @param role The new role value for the org member.
   */
  onEditRole(role: OrgRoleEnum): void {
    this.store.dispatch(
      OrgMemberActions.editOrgMember({ updateOrgMemberDto: { role } })
    );
  }

  /**
   * Delete the current org member.
   */
  onDelete(): void {
    this.store.dispatch(OrgMemberActions.deleteOrgMember());
  }
}
