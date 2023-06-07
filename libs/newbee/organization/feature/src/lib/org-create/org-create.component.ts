import { Component, OnDestroy, OnInit } from '@angular/core';
import { organizationFeature } from '@newbee/newbee/organization/data-access';
import type { CreateOrgForm } from '@newbee/newbee/organization/util';
import {
  HttpActions,
  httpFeature,
  OrganizationActions,
} from '@newbee/newbee/shared/data-access';
import type { HttpClientError } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

/**
 * The smart UI for the create organization screen.
 */
@Component({
  selector: 'newbee-org-create',
  templateUrl: './org-create.component.html',
})
export class OrgCreateComponent implements OnInit, OnDestroy {
  /**
   * Emits to unsubscribe from all infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * Whether the create action is pending.
   */
  pendingCreate$ = this.store.select(organizationFeature.selectPendingCreate);

  /**
   * Request HTTP error, if any exist.
   */
  httpClientError: HttpClientError | null = null;

  constructor(private readonly store: Store) {}

  /**
   * Converts a partial of `CreateOrgForm` to the real deal.
   *
   * @param partialCreateOrgForm The partial to convert.
   *
   * @returns The `CreateOrgForm` converted from the partial.
   */
  private static partialToCreateOrgForm(
    partialCreateOrgForm: Partial<CreateOrgForm>
  ): CreateOrgForm {
    const { name } = partialCreateOrgForm;
    return { ...partialCreateOrgForm, name: name ?? '' };
  }

  /**
   * Set the httpClientError based on the value in the store.
   */
  ngOnInit(): void {
    this.store.dispatch(OrganizationActions.orgCreateComponentInit());

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
   * When the dumb UI emits a create event, send a create action with the value of the create org form.
   *
   * @param partialCreateOrgForm The form to send to the backend.
   */
  onCreate(partialCreateOrgForm: Partial<CreateOrgForm>): void {
    const createOrgForm =
      OrgCreateComponent.partialToCreateOrgForm(partialCreateOrgForm);
    this.store.dispatch(OrganizationActions.createOrg({ createOrgForm }));
  }
}
