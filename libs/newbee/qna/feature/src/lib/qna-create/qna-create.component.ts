import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { qnaFeature } from '@newbee/newbee/qna/data-access';
import {
  QnaActions,
  httpFeature,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import { BaseCreateQnaDto, Keyword } from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

/**
 * The smart UI for creating a qna.
 */
@Component({
  selector: 'newbee-qna-create',
  templateUrl: './qna-create.component.html',
})
export class QnaCreateComponent {
  /**
   * Whether the create action is pending.
   */
  pendingCreate$ = this.store.select(qnaFeature.selectPendingCreate);

  /**
   * Request HTTP error, if any exist.
   */
  httpClientError$ = this.store.select(httpFeature.selectError);

  /**
   * The currently selected organization.
   */
  selectedOrganization$ = this.store.select(
    organizationFeature.selectSelectedOrganization,
  );

  /**
   * The team slug taken from the route's query params.
   */
  teamSlugParam$ = this.route.queryParamMap.pipe(
    map((params) => params.get(Keyword.Team) ?? null),
  );

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
  ) {}

  /**
   * When the dumb UI emits a create event, send a create action with the value.
   *
   * @param createQnaDto The value to use to create a QnA.
   */
  onCreate(createQnaDto: BaseCreateQnaDto): void {
    this.store.dispatch(QnaActions.createQna({ createQnaDto }));
  }
}
