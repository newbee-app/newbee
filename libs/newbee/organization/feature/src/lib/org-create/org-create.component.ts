import { Component, OnDestroy, OnInit } from '@angular/core';
import { organizationFeature } from '@newbee/newbee/organization/data-access';
import type { OrgForm } from '@newbee/newbee/organization/util';
import {
  HttpActions,
  httpFeature,
  OrganizationActions,
} from '@newbee/newbee/shared/data-access';
import type { HttpClientError } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

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
   * Represents the form's current name value, for use in generating slugs.
   */
  readonly name$ = new Subject<string>();

  /**
   * The auto-generated slug based on the org's name.
   */
  generatedSlug$ = this.store.select(organizationFeature.selectGeneratedSlug);

  /**
   * Whether the form's slug value is taken.
   */
  slugTaken$ = this.store.select(organizationFeature.selectSlugTaken);

  /**
   * Whether the create action is pending.
   */
  pendingCreate$ = this.store.select(organizationFeature.selectPendingCreate);

  /**
   * Whether the check slug action is pending.
   */
  pendingCheck$ = this.store.select(organizationFeature.selectPendingCheck);

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
    partialCreateOrgForm: Partial<OrgForm>
  ): OrgForm {
    const { name, slug } = partialCreateOrgForm;
    return { ...partialCreateOrgForm, name: name ?? '', slug: slug ?? '' };
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

    this.name$.pipe(debounceTime(600), distinctUntilChanged()).subscribe({
      next: (name) => {
        this.store.dispatch(OrganizationActions.generateSlug({ name }));
      },
    });
  }

  /**
   * Unsubscribe from all infinite observables.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();

    for (const subject of [this.name$, this.unsubscribe$]) {
      subject.complete();
    }
  }

  /**
   * When the dumb UI emits a name event, emit it to the name$ subject.
   *
   * @param name The name to emit.
   */
  onName(name: string): void {
    this.name$.next(name);
  }

  /**
   * When the dumb UI emits a slug event, dispatch it to the store.
   *
   * @param slug The slug to emit.
   */
  onSlug(slug: string): void {
    this.store.dispatch(OrganizationActions.typingSlug({ slug }));
  }

  /**
   * When the dumb UI emits a formattedSlug event, dispatch it to the store.
   *
   * @param slug
   */
  onFormattedSlug(slug: string): void {
    this.store.dispatch(OrganizationActions.checkSlug({ slug }));
  }

  /**
   * When the dumb UI emits a create event, send a create action with the value of the create org form.
   *
   * @param partialCreateOrgForm The form to send to the backend.
   */
  onCreate(partialCreateOrgForm: Partial<OrgForm>): void {
    const createOrgForm =
      OrgCreateComponent.partialToCreateOrgForm(partialCreateOrgForm);
    this.store.dispatch(OrganizationActions.createOrg({ createOrgForm }));
  }
}
