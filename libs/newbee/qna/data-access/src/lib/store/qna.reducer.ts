import {
  HttpActions,
  QnaActions,
  RouterActions,
} from '@newbee/newbee/shared/data-access';
import { Keyword } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';

/**
 * Module-specific piece of state related to QnAs.
 */
export interface QnaState {
  /**
   * Whether the user is waiting for a response for creating a qna.
   */
  pendingCreate: boolean;

  /**
   * Whether the user is waiting for a response for editing a question.
   */
  pendingEditQuestion: boolean;

  /**
   * Whether the user is waiting for a response for editing an answer.
   */
  pendingEditAnswer: boolean;

  /**
   * Whether the user is waiting for a response for marking a qna up-to-date.
   */
  pendingUpToDate: boolean;

  /**
   * Whether the user is waiting for a response for deleting a qna.
   */
  pendingDelete: boolean;
}

/**
 * The initial value for `QnaState`.
 */
export const initialQnaState: QnaState = {
  pendingCreate: false,
  pendingEditQuestion: false,
  pendingEditAnswer: false,
  pendingUpToDate: false,
  pendingDelete: false,
};

/**
 * The reducers and generated selectors for `QnaState`.
 */
export const qnaFeature = createFeature({
  name: `${Keyword.Qna}Module`,
  reducer: createReducer(
    initialQnaState,
    on(
      QnaActions.createQna,
      (state): QnaState => ({
        ...state,
        pendingCreate: true,
      }),
    ),
    on(
      QnaActions.markQnaAsUpToDate,
      (state): QnaState => ({ ...state, pendingUpToDate: true }),
    ),
    on(
      QnaActions.createQnaSuccess,
      QnaActions.markQnaAsUpToDateSuccess,
      HttpActions.clientError,
      RouterActions.routerRequest,
      (): QnaState => initialQnaState,
    ),
  ),
});
