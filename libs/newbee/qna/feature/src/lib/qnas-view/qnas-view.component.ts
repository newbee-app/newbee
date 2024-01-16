import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { qnaFeature } from '@newbee/newbee/qna/data-access';
import { QnaActions, httpFeature } from '@newbee/newbee/shared/data-access';
import { Keyword, SolrEntryEnum } from '@newbee/shared/util';
import { Store } from '@ngrx/store';

/**
 * The smart UI for viewing all of the qnas in an org.
 */
@Component({
  selector: 'newbee-qnas-view',
  templateUrl: './qnas-view.component.html',
})
export class QnasViewComponent {
  /**
   * The HTTP client error.
   */
  httpClientError$ = this.store.select(httpFeature.selectError);

  /**
   * The qna module state.
   */
  qnaModuleState$ = this.store.select(qnaFeature.selectQnaModuleState);

  /**
   * Dispatch the request to get qnas.
   */
  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    store.dispatch(QnaActions.getQnas());
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
   * @param query The search query as a string.
   */
  async onSearch(query: string): Promise<void> {
    await this.router.navigate([`../${Keyword.Search}/${query}`], {
      relativeTo: this.route,
      queryParams: { [Keyword.Type]: SolrEntryEnum.Qna },
    });
  }

  /**
   * Fetch more qnas once the user has scrolled to the bottom.
   */
  onScrolled(): void {
    this.store.dispatch(QnaActions.getQnas());
  }
}
