import { Component, OnDestroy, OnInit } from '@angular/core';
import { organizationFeature } from '@newbee/newbee/organization/data-access';
import {
  CreateOrgForm,
  createOrgFormToDto,
} from '@newbee/newbee/organization/util';
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
   * @param name The name to dispatch.
   */
  onName(name: string): void {
    this.name$.next(name);
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
   * When the dumb UI emits a create event, send a create action with the value of the org form.
   *
   * @param createOrgForm The values to send to the backend.
   */
  onCreate(createOrgForm: Partial<CreateOrgForm>): void {
    this.store.dispatch(
      OrganizationActions.createOrg({
        createOrganizationDto: createOrgFormToDto(createOrgForm),
      })
    );
  }
}
