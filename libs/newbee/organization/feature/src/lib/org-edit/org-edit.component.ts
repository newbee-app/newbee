import { Component } from '@angular/core';
import { organizationFeature as orgModuleFeature } from '@newbee/newbee/organization/data-access';
import {
  httpFeature,
  OrganizationActions,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import { UpdateOrganizationDto } from '@newbee/shared/util';
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
   * The org state.
   */
  orgState$ = this.store.select(organizationFeature.selectOrgState);

  /**
   * The org module state.
   */
  orgModuleState$ = this.store.select(orgModuleFeature.selectOrgModuleState);

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
   * @param updateOrganizationDto The values to send to the backend.
   */
  onEdit(updateOrganizationDto: UpdateOrganizationDto): void {
    this.store.dispatch(OrganizationActions.editOrg({ updateOrganizationDto }));
  }

  /**
   * When the dumb UI emits an edit slug event, send an edit slug action with the value of the org form.
   *
   * @param updateOrganizationDto The values to send to the backend.
   */
  onEditSlug(updateOrganizationDto: UpdateOrganizationDto): void {
    this.store.dispatch(
      OrganizationActions.editOrgSlug({ updateOrganizationDto }),
    );
  }

  /**
   * When the dumb UI emits a delete org event, dispatch it to the store.
   */
  onDelete(): void {
    this.store.dispatch(OrganizationActions.deleteOrg());
  }
}
