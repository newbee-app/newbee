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
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'newbee-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  /**
   * Emits to unsubscribe from all infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

  user$ = this.store.select(authFeature.selectUser);

  organizationOptions: SelectOption<Organization>[] = [];
  selectedOrganization: SelectOption<Organization> | null = null;

  constructor(private readonly store: Store, private readonly router: Router) {}

  ngOnInit(): void {
    this.store
      .select(organizationFeature.selectOrganizationState)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: ({ organizations, selectedOrganization }) => {
          this.organizationOptions = organizations.map(
            (organization) =>
              new SelectOption(
                organization,
                organization.slug,
                organization.name
              )
          );

          this.selectedOrganization =
            this.organizationOptions.find(
              (option) => option.value === selectedOrganization?.organization
            ) ?? null;
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  selectOrganization(organization: Organization | null): void {
    this.store.dispatch(
      OrganizationActions.getAndSelectOrg({
        orgSlug: organization?.slug ?? null,
      })
    );
  }

  search(searchTerm: string): void {
    const queryDto: BaseQueryDto = { query: searchTerm, offset: 0 };
    this.store.dispatch(SearchActions.search({ query: queryDto }));
  }

  suggest(suggestTerm: string): void {
    const suggestDto: BaseSuggestDto = { query: suggestTerm };
    this.store.dispatch(SearchActions.suggest({ query: suggestDto }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  async navigateToLink(routeKeyword: RouteKeyword): Promise<void> {
    await this.router.navigate([keywordToRoute[routeKeyword]]);
  }
}
