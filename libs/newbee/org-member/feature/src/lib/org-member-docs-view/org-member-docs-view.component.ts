import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { orgMemberFeature } from '@newbee/newbee/org-member/data-access';
import {
  OrgMemberActions,
  httpFeature,
} from '@newbee/newbee/shared/data-access';
import {
  OrgMemberPostTab,
  RouteAndQueryParams,
  ShortUrl,
  orgMemberPostTabToStr,
  strToOrgMemberPostTab,
} from '@newbee/newbee/shared/util';
import {
  CreatorOrMaintainer,
  Keyword,
  SolrEntryEnum,
} from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

/**
 * The smart UI for viewing an org member's docs.
 */
@Component({
  selector: 'newbee-org-member-docs-view',
  templateUrl: './org-member-docs-view.component.html',
})
export class OrgMemberDocsViewComponent implements OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * The HTTP client error.
   */
  httpClientError$ = this.store.select(httpFeature.selectError);

  /**
   * The member module state.
   */
  memberModuleState$ = this.store.select(
    orgMemberFeature.selectMemberModuleState,
  );

  /**
   * Whether to look for docs where the org member is the creator or maintainer.
   */
  get role(): CreatorOrMaintainer | null {
    return this._role;
  }
  private _role: CreatorOrMaintainer | null = 'maintainer';

  /**
   * The role query param as an org member post tab.
   */
  get orgMemberTab(): OrgMemberPostTab {
    return strToOrgMemberPostTab(this._role);
  }

  /**
   * The slug of the currently selected org member.
   */
  get orgMemberSlug(): string | null {
    return this._orgMemberSlug;
  }
  private _orgMemberSlug: string | null = null;

  /**
   * Subscribe to the route's org member slug and query params and dispatch the request to get docs.
   */
  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    route.queryParamMap.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (queryParamMap) => {
        const roleQueryParam = queryParamMap.get(Keyword.Role);
        this._role =
          roleQueryParam === 'creator' || roleQueryParam === 'maintainer'
            ? roleQueryParam
            : null;
        this.getDocs();
      },
    });

    route.parent?.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (paramMap) => {
        this._orgMemberSlug = paramMap.get(ShortUrl.Member);
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
   * Change the value for the org member tab.
   *
   * @param orgMemberTab The new value for the org member tab.
   */
  async onOrgMemberTabChange(orgMemberTab: OrgMemberPostTab): Promise<void> {
    await this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: { [Keyword.Role]: orgMemberPostTabToStr(orgMemberTab) },
    });
  }

  /**
   * Navigate to a path relative to the currently selected org.
   *
   * @param path The route and query params to navigate to.
   */
  async onOrgNavigate(routeAndQueryParams: RouteAndQueryParams): Promise<void> {
    const { route, queryParams } = routeAndQueryParams;
    await this.router.navigate([`../../../${route}`], {
      relativeTo: this.route,
      ...(queryParams && { queryParams }),
    });
  }

  /**
   * Navigate to the search URL associated with the query if the user fires a search request.
   *
   * @param query The search query as a string.
   */
  async onSearch(query: string): Promise<void> {
    await this.router.navigate([`../../../${Keyword.Search}/${query}`], {
      relativeTo: this.route,
      queryParams: {
        [Keyword.Type]: SolrEntryEnum.Doc,
        ...(this._orgMemberSlug && {
          [this._role ? this._role : ShortUrl.Member]: this._orgMemberSlug,
        }),
      },
    });
  }

  /**
   * Fetch more docs.
   */
  getDocs(): void {
    this.store.dispatch(OrgMemberActions.getDocs({ role: this._role }));
  }
}
