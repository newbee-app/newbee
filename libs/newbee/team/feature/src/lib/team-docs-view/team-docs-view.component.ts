import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamActions, httpFeature } from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { teamFeature } from '@newbee/newbee/team/data-access';
import { Keyword, SolrEntryEnum } from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

/**
 * The smart UI for viewing all of the docs in a team.
 */
@Component({
  selector: 'newbee-team-docs-view',
  templateUrl: './team-docs-view.component.html',
})
export class TeamDocsViewComponent implements OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * The HTTP client error.
   */
  httpClientError$ = this.store.select(httpFeature.selectError);

  /**
   * The team module state.
   */
  teamModuleState$ = this.store.select(teamFeature.selectTeamModuleState);

  /**
   * The slug of the currently selected team.
   */
  get teamSlug(): string | null {
    return this._teamSlug;
  }
  private _teamSlug: string | null = null;

  /**
   * Dispatch the request to get docs and get the selected team's slug.
   */
  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    store.dispatch(TeamActions.getDocs());

    route.parent?.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (paramMap) => {
        this._teamSlug = paramMap.get(ShortUrl.Team);
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
   * Navigate to a path relative to the currently selected org.
   *
   * @param path The path to navigate to.
   */
  async onOrgNavigate(path: string): Promise<void> {
    await this.router.navigate([`../../../${path}`], {
      relativeTo: this.route,
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
        ...(this._teamSlug && { [ShortUrl.Team]: this._teamSlug }),
      },
    });
  }

  /**
   * Fetch more docs once the user has scrolled to the bottom.
   */
  onScrolled(): void {
    this.store.dispatch(TeamActions.getDocs());
  }
}
