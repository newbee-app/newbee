import { Component } from '@angular/core';
import { qnaFeature as qnaModuleFeature } from '@newbee/newbee/qna/data-access';
import {
  QnaActions,
  httpFeature,
  organizationFeature,
  qnaFeature,
  selectOrgMemberUser,
} from '@newbee/newbee/shared/data-access';
import { UpdateAnswerDto, UpdateQuestionDto } from '@newbee/shared/util';
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
   * The OrgMemberUser making the request.
   */
  orgMemberUser$ = this.store.select(selectOrgMemberUser);

  /**
   * The org state.
   */
  orgState$ = this.store.select(organizationFeature.selectOrgState);

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
  onEditQuestion(updateQuestionDto: UpdateQuestionDto): void {
    this.store.dispatch(QnaActions.editQuestion({ updateQuestionDto }));
  }

  /**
   * Dispatch editAnswer with the given details when the dumb UI emits.
   *
   * @param updateAnswerDto The new details for the currently selected qna.
   */
  onEditAnswer(updateAnswerDto: UpdateAnswerDto): void {
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
