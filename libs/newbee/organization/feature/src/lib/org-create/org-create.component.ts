import { Component, OnDestroy } from '@angular/core';
import { organizationFeature } from '@newbee/newbee/organization/data-access';
import {
  OrganizationActions,
  httpFeature,
} from '@newbee/newbee/shared/data-access';
import { CreateOrganizationDto } from '@newbee/shared/util';
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
   * The org module state.
   */
  orgModuleState$ = this.store.select(organizationFeature.selectOrgModuleState);

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
  onCreate(createOrganizationDto: CreateOrganizationDto): void {
    this.store.dispatch(
      OrganizationActions.createOrg({ createOrganizationDto }),
    );
  }
}
