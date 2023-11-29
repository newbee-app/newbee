import { Component } from '@angular/core';
import {
  qnaFeature as qnaModuleFeature,
  selectQnaTeams,
} from '@newbee/newbee/qna/data-access';
import {
  QnaActions,
  httpFeature,
  organizationFeature,
  qnaFeature,
} from '@newbee/newbee/shared/data-access';
import {
  BaseUpdateAnswerDto,
  BaseUpdateQuestionDto,
} from '@newbee/shared/util';
import { Store } from '@ngrx/store';

/**
 * The smart UI for editing a qna.
 */
@Component({
  selector: 'newbee-qna-edit',
  templateUrl: './qna-edit.component.html',
})
export class QnaEditComponent {
  /**
   * HTTP client errors.
   */
  httpClientError$ = this.store.select(httpFeature.selectError);

  /**
   * The entire qna state.
   */
  qnaState$ = this.store.select(qnaFeature.selectQnaState);

  /**
   * The org member associated with the user.
   */
  orgMember$ = this.store.select(organizationFeature.selectOrgMember);

  /**
   * The currently selected org.
   */
  selectedOrganization$ = this.store.select(
    organizationFeature.selectSelectedOrganization,
  );

  /**
   * The teams that the user can move the qna to.
   */
  teams$ = this.store.select(selectQnaTeams);

  /**
   * The entire qna module state.
   */
  qnaModuleState$ = this.store.select(qnaModuleFeature.selectQnaModuleState);

  constructor(private readonly store: Store) {}

  /**
   * Dispatch editQuestion with the given details when the dumb UI emits.
   *
   * @param updateQuestionDto The new details for the currently selected qna.
   */
  onEditQuestion(updateQuestionDto: BaseUpdateQuestionDto): void {
    this.store.dispatch(QnaActions.editQuestion({ updateQuestionDto }));
  }

  /**
   * Dispatch editAnswer with the given details when the dumb UI emits.
   *
   * @param updateAnswerDto The new details for the currently selected qna.
   */
  onEditAnswer(updateAnswerDto: BaseUpdateAnswerDto): void {
    this.store.dispatch(QnaActions.editAnswer({ updateAnswerDto }));
  }

  /**
   * Dispatch markQnaAsUpToDate when the dumb UI emits.
   */
  onMarkAsUpToDate(): void {
    this.store.dispatch(QnaActions.markQnaAsUpToDate());
  }

  /**
   * Dispatch deleteQna when the dumb UI emits.
   */
  onDelete(): void {
    this.store.dispatch(QnaActions.deleteQna());
  }
}
