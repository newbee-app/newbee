import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { qnaFeature as qnaModuleFeature } from '@newbee/newbee/qna/data-access';
import {
  QnaActions,
  httpFeature,
  organizationFeature,
  qnaFeature,
} from '@newbee/newbee/shared/data-access';
import { RouteAndQueryParams } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';

/**
 * The smart UI component for viewing a qna.
 */
@Component({
  selector: 'newbee-qna-view',
  templateUrl: './qna-view.component.html',
})
export class QnaViewComponent {
  /**
   * The HTTP client error.
   */
  httpClientError$ = this.store.select(httpFeature.selectError);

  /**
   * The qna state.
   */
  qnaState$ = this.store.select(qnaFeature.selectQnaState);

  /**
   * The current user's role in the qna's org, if any.
   */
  orgMember$ = this.store.select(organizationFeature.selectOrgMember);

  /**
   * Whether the mark as up-to-date action is pending.
   */
  pendingUpToDate$ = this.store.select(qnaModuleFeature.selectPendingUpToDate);

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  /**
   * Navigate to a path relative to the current org.
   *
   * @param routeAndQueryParams The route and query params to navigate to.
   */
  async onOrgNavigate(routeAndQueryParams: RouteAndQueryParams): Promise<void> {
    const { route, queryParams } = routeAndQueryParams;
    await this.router.navigate([`../../${route}`], {
      relativeTo: this.route,
      ...(queryParams && { queryParams }),
    });
  }

  /**
   * Navigate to a path relative to the current qna.
   *
   * @param routeAndQueryParams The route and query params to navigate to.
   */
  async onQnaNavigate(routeAndQueryParams: RouteAndQueryParams): Promise<void> {
    const { route, queryParams } = routeAndQueryParams;
    await this.router.navigate([`./${route}`], {
      relativeTo: this.route,
      ...(queryParams && { queryParams }),
    });
  }

  /**
   * Mark the currently selected qna as up-to-date.
   */
  onMarkAsUpToDate(): void {
    this.store.dispatch(QnaActions.markQnaAsUpToDate());
  }
}
