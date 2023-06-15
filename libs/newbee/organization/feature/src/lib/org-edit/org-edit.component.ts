import { Component, OnDestroy, OnInit } from '@angular/core';
import { organizationFeature as orgModuleFeature } from '@newbee/newbee/organization/data-access';
import {
  EditOrgForm,
  editOrgFormToDto,
  EditOrgSlugForm,
  editOrgSlugFormToDto,
} from '@newbee/newbee/organization/util';
import {
  HttpActions,
  httpFeature,
  OrganizationActions,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import type { HttpClientError } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

/**
 * The smart UI for the edit organization screen.
 */
@Component({
  selector: 'newbee-org-edit',
  templateUrl: './org-edit.component.html',
})
export class OrgEditComponent implements OnInit, OnDestroy {
  /**
   * Emits to unsubscribe from all infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * The currently selected organization.
   */
  selectedOrganization$ = this.store.select(
    organizationFeature.selectSelectedOrganization
  );

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
  httpClientError: HttpClientError | null = null;

  constructor(private readonly store: Store) {}

  /**
   * Reset all pending actions and set the httpClientError based on the value in the store.
   */
  ngOnInit(): void {
    this.store.dispatch(OrganizationActions.resetPendingActions());

    this.store
      .select(httpFeature.selectError)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (error) => {
          if (!error) {
            return;
          }

          this.httpClientError = error;
          this.store.dispatch(HttpActions.resetError());
        },
      });
  }

  /**
   * Unsubscribe from all infinite observables.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

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
