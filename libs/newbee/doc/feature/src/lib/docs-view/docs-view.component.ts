import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { docFeature } from '@newbee/newbee/doc/data-access';
import { DocActions, httpFeature } from '@newbee/newbee/shared/data-access';
import { RouteAndQueryParams } from '@newbee/newbee/shared/util';
import { Keyword, SolrEntryEnum } from '@newbee/shared/util';
import { Store } from '@ngrx/store';

/**
 * The smart UI for viewing all of the docs in an org.
 */
@Component({
  selector: 'newbee-docs-view',
  templateUrl: './docs-view.component.html',
})
export class DocsViewComponent {
  /**
   * The HTTP client error.
   */
  httpClientError$ = this.store.select(httpFeature.selectError);

  /**
   * The doc module state.
   */
  docModuleState$ = this.store.select(docFeature.selectDocModuleState);

  /**
   * Dispatch the request to get docs.
   */
  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    store.dispatch(DocActions.getDocs());
  }

  /**
   * Navigate to a path relative to the currently selected org.
   *
   * @param routeAndQueryParams The path to navigate to.
   */
  async onOrgNavigate(routeAndQueryParams: RouteAndQueryParams): Promise<void> {
    const { route, queryParams } = routeAndQueryParams;
    await this.router.navigate([`../${route}`], {
      relativeTo: this.route,
      ...(queryParams && { queryParams }),
    });
  }

  /**
   * Navigate to the search URL associated with the query if the user fires a search request.
   *
   * @param query The serach query as a string.
   */
  async onSearch(query: string): Promise<void> {
    await this.router.navigate([`../${Keyword.Search}/${query}`], {
      relativeTo: this.route,
      queryParams: { [Keyword.Type]: SolrEntryEnum.Doc },
    });
  }

  /**
   * Fetch more docs once the user has hit the bottom.
   */
  onContinueSearch(): void {
    this.store.dispatch(DocActions.getDocs());
  }
}
