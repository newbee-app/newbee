import { Component, OnDestroy } from '@angular/core';
import { organizationFeature } from '@newbee/newbee/organization/data-access';
import {
  OrganizationActions,
  httpFeature,
} from '@newbee/newbee/shared/data-access';
import { BaseCreateOrganizationDto } from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

/**
 * The smart UI for the create organization screen.
 */
@Component({
  selector: 'newbee-org-create',
  templateUrl: './org-create.component.html',
})
export class OrgCreateComponent implements OnDestroy {
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
  httpClientError$ = this.store.select(httpFeature.selectError);

  /**
   * Set up the `name$` subject to generate slug.
   */
  constructor(private readonly store: Store) {
    this.name$.pipe(debounceTime(600), distinctUntilChanged()).subscribe({
      next: (name) => {
        store.dispatch(OrganizationActions.generateSlug({ name }));
      },
    });
  }

  /**
   * Unsubscribe from all infinite observables.
   */
  ngOnDestroy(): void {
    this.name$.complete();
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
   * @param createOrganizationDto The values to send to the backend.
   */
  onCreate(createOrganizationDto: BaseCreateOrganizationDto): void {
    this.store.dispatch(
      OrganizationActions.createOrg({ createOrganizationDto }),
    );
  }
}
