import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthActions,
  authFeature,
  OrganizationActions,
  organizationFeature,
  SearchActions,
} from '@newbee/newbee/shared/data-access';
import {
  keywordToRoute,
  RouteKeyword,
  SelectOption,
} from '@newbee/newbee/shared/util';
import { BaseQueryDto, BaseSuggestDto } from '@newbee/shared/data-access';
import type { Organization } from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { isEqual } from 'lodash-es';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

/**
 * The smart UI for the home screen.
 */
@Component({
  selector: 'newbee-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  /**
   * Emits to unsubscribe from all infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * Represents the searchbar's current value, for use in generating suggestions.
   */
  readonly searchTerm$ = new Subject<string>();

  /**
   * The logged in user.
   */
  user$ = this.store.select(authFeature.selectUser);

  /**
   * All of the organizations the user is a part of.
   */
  organizationOptions: SelectOption<Organization>[] = [];

  /**
   * The organization the user is currently viewing.
   */
  selectedOrganization: SelectOption<Organization> | null = null;

  constructor(private readonly store: Store, private readonly router: Router) {}

  /**
   * Selects the organization specified in the state and converts the organizations into select options.
   *
   */
  ngOnInit(): void {
    this.store
      .select(organizationFeature.selectOrganizations)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (organizations) => {
          this.organizationOptions = organizations.map(
            (organization) =>
              new SelectOption(
                organization,
                organization.slug,
                organization.name
              )
          );
        },
      });

    this.store
      .select(organizationFeature.selectSelectedOrganization)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (selectedOrganization) => {
          this.selectedOrganization =
            this.organizationOptions.find((option) =>
              isEqual(option.value, selectedOrganization?.organization)
            ) ?? null;
        },
      });

    this.searchTerm$.pipe(debounceTime(300), distinctUntilChanged()).subscribe({
      next: (searchTerm) => {
        const suggestDto: BaseSuggestDto = { query: searchTerm };
        this.store.dispatch(SearchActions.suggest({ query: suggestDto }));
      },
    });
  }

  /**
   * Unsubscribe from all infinite observables.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.searchTerm$.complete();
  }

  /**
   * When the dumb UI emits a selectedOrganizationChange evet, send a getAndSelectOrg action with the value of the organization.
   *
   * @param organization The organization to select and view.
   */
  selectOrganization(organization: Organization | null): void {
    this.store.dispatch(
      OrganizationActions.getAndSelectOrg({
        orgSlug: organization?.slug ?? null,
      })
    );
  }

  /**
   * When the dumb UI emits a search event, send a search action with the value of the search term.
   *
   * @param searchTerm The value of the search term.
   */
  search(searchTerm: string): void {
    const queryDto: BaseQueryDto = { query: searchTerm, offset: 0 };
    this.store.dispatch(SearchActions.search({ query: queryDto }));
  }

  /**
   * When the dumb UI emits a searchbar event, emit it to the searchTerm$ subject.
   *
   * @param searchTerm The value of the searchbar.
   */
  searchbar(searchTerm: string): void {
    this.searchTerm$.next(searchTerm);
  }

  /**
   * When the dumb UI emits a logout event, send a logout action.
   */
  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  /**
   * When the dumb UI emits a navigateToLink event, navigate to the desired link.
   *
   * @param routeKeyword The keyword of the route to navigate to.
   */
  async navigateToLink(routeKeyword: RouteKeyword): Promise<void> {
    await this.router.navigate([keywordToRoute[routeKeyword]]);
  }
}
