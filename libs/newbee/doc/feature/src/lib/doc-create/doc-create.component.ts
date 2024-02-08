import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { docFeature } from '@newbee/newbee/doc/data-access';
import {
  DocActions,
  httpFeature,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import { CreateDocDto, Keyword } from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

/**
 * The smart UI for creating a doc.
 */
@Component({
  selector: 'newbee-doc-create',
  templateUrl: './doc-create.component.html',
})
export class DocCreateComponent {
  /**
   * HTTP client error, if any.
   */
  httpClientError$ = this.store.select(httpFeature.selectError);

  /**
   * Whether the create action is pending.
   */
  pendingCreate$ = this.store.select(docFeature.selectPendingCreate);

  /**
   * The org state.
   */
  orgState$ = this.store.select(organizationFeature.selectOrgState);

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
   * @param createDocDto The value to use to create a doc.
   */
  onCreate(createDocDto: CreateDocDto): void {
    this.store.dispatch(DocActions.createDoc({ createDocDto }));
  }
}
