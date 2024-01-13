import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { docFeature } from '@newbee/newbee/doc/data-access';
import { DocActions, httpFeature } from '@newbee/newbee/shared/data-access';
import {
  DocQueryResult,
  Keyword,
  PaginatedResults,
  SolrEntryEnum,
} from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

/**
 * The smart UI for viewing all of the docs in an org.
 */
@Component({
  selector: 'newbee-docs-view',
  templateUrl: './docs-view.component.html',
})
export class DocsViewComponent implements OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * The HTTP client error.
   */
  httpClientError$ = this.store.select(httpFeature.selectError);

  /**
   * Whether the get docs action is pending.
   */
  pendingGetDocs$ = this.store.select(docFeature.selectPendingGetDocs);

  /**
   * All of the docs of the currently selected org in a paginated format.
   */
  get docs(): PaginatedResults<DocQueryResult> | null {
    return this._docs;
  }
  private _docs: PaginatedResults<DocQueryResult> | null = null;

  /**
   * Dispatch the request to get docs and make sure to link the store's value to the internal `_docs`.
   */
  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    store.dispatch(DocActions.getDocs());
    store
      .select(docFeature.selectDocs)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (docs) => {
          this._docs = docs;
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
    await this.router.navigate([`../${path}`], { relativeTo: this.route });
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
   * Fetch more docs once the user has scrolled to the bottom.
   */
  onScrolled(): void {
    this.store.dispatch(DocActions.getDocs());
  }
}
