import { Component } from '@angular/core';
import { organizationFeature as orgModuleFeature } from '@newbee/newbee/organization/data-access';
import {
  EditOrgForm,
  editOrgFormToDto,
  EditOrgSlugForm,
  editOrgSlugFormToDto,
} from '@newbee/newbee/organization/util';
import {
  httpFeature,
  OrganizationActions,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';

/**
 * The smart UI for the edit organization screen.
 */
@Component({
  selector: 'newbee-org-edit',
  templateUrl: './org-edit.component.html',
})
export class OrgEditComponent {
  /**
   * The currently selected organization.
   */
  selectedOrganization$ = this.store.select(
    organizationFeature.selectSelectedOrganization
  );

  /**
   * The user's relation to the currently selected org, if any.
   */
  orgMember$ = this.store.select(organizationFeature.selectOrgMember);

  /**
   * Whether the form's slug value is taken, excluding the slug for the currently selected org.
   */
  slugTaken$ = this.store.select(orgModuleFeature.selectSlugTaken);

  /**
   * Whether the edit action is pending.
   */
  editPending$ = this.store.select(orgModuleFeature.selectPendingEdit);

  /**
   * Whether the edit slug action is pending.
   */
  editSlugPending$ = this.store.select(orgModuleFeature.selectPendingEditSlug);

  /**
   * Whether the check slug action is pending.
   */
  checkPending$ = this.store.select(orgModuleFeature.selectPendingCheck);

  /**
   * Whether the delete org action is pending.
   */
  deletePending$ = this.store.select(orgModuleFeature.selectPendingDelete);

  /**
   * Request HTTP error, if any exist.
   */
  httpClientError$ = this.store.select(httpFeature.selectError);

  constructor(private readonly store: Store) {}

  /**
   * When the dumb UI emits a slug event, dispatch it to the store.
   *
   * @param slug The slug to dispatch.
   */
  onSlug(slug: string): void {
    this.store.dispatch(OrganizationActions.typingSlug({ slug }));
  }

  /**
   * When the dumb UI emits a formattedSlug event, dispatch it to the store.
   *
   * @param slug The slug to dispatch.
   */
  onFormattedSlug(slug: string): void {
    this.store.dispatch(OrganizationActions.checkSlug({ slug }));
  }

  /**
   * When the dumb UI emits an edit event, send an edit action with the value of the org form.
   *
   * @param editOrgForm The values to send to the backend.
   */
  onEdit(editOrgForm: Partial<EditOrgForm>): void {
    this.store.dispatch(
      OrganizationActions.editOrg({
        updateOrganizationDto: editOrgFormToDto(editOrgForm),
      })
    );
  }

  /**
   * When the dumb UI emits an edit slug event, send an edit slug action with the value of the org form.
   *
   * @param editOrgSlugForm The values to send to the backend.
   */
  onEditSlug(editOrgSlugForm: Partial<EditOrgSlugForm>): void {
    this.store.dispatch(
      OrganizationActions.editOrgSlug({
        updateOrganizationDto: editOrgSlugFormToDto(editOrgSlugForm),
      })
    );
  }

  /**
   * When the dumb UI emits a delete org event, dispatch it to the store.
   */
  onDelete(): void {
    this.store.dispatch(OrganizationActions.deleteOrg());
  }
}
