import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { qnaFeature as qnaModuleFeature } from '@newbee/newbee/qna/data-access';
import {
  QnaActions,
  organizationFeature,
  qnaFeature,
} from '@newbee/newbee/shared/data-access';
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
   * The currently selected qna.
   */
  selectedQna$ = this.store.select(qnaFeature.selectSelectedQna);

  /**
   * The current user's role in the qna's org, if any.
   */
  orgMember$ = this.store.select(organizationFeature.selectOrgMember);

  /**
   * The current user's role in the qna's team, if any.
   */
  teamMember$ = this.store.select(qnaFeature.selectTeamMember);

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
   * @param path The path to navigate to.
   */
  async onOrgNavigate(path: string): Promise<void> {
    await this.router.navigate([`../../${path}`], { relativeTo: this.route });
  }

  /**
   * Navigate to a path relative to the current qna.
   *
   * @param path The path to navigate to.
   */
  async onQnaNavigate(path: string): Promise<void> {
    await this.router.navigate([`./${path}`], { relativeTo: this.route });
  }

  /**
   * Mark the currently selected qna as up-to-date.
   */
  onMarkAsUpToDate(): void {
    this.store.dispatch(QnaActions.markQnaAsUpToDate());
  }
}
