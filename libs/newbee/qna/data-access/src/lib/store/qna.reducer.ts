import {
  HttpActions,
  QnaActions,
  RouterActions,
} from '@newbee/newbee/shared/data-access';
import { canGetMoreResults } from '@newbee/newbee/shared/util';
import { Keyword, PaginatedResults, QnaQueryResult } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';

/**
 * Module-specific piece of state related to QnAs.
 */
export interface QnaState {
  /**
   * All of the qnas of the org as paginated results.
   */
  qnas: PaginatedResults<QnaQueryResult> | null;

  /**
   * Whether the user is waiting for a resposne for getting all paginated qnas.
   */
  pendingGetQnas: boolean;

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
  qnas: null,
  pendingGetQnas: false,
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
      QnaActions.getQnas,
      (state): QnaState => ({
        ...state,
        pendingGetQnas: canGetMoreResults(state.qnas),
      }),
    ),
    on(
      QnaActions.getQnasSuccess,
      (state, { qnas }): QnaState => ({
        ...state,
        pendingGetQnas: false,
        qnas: {
          ...qnas,
          results: [...(state.qnas?.results ?? []), ...qnas.results],
        },
      }),
    ),
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
      QnaActions.editQuestion,
      (state): QnaState => ({ ...state, pendingEditQuestion: true }),
    ),
    on(
      QnaActions.editAnswer,
      (state): QnaState => ({ ...state, pendingEditAnswer: true }),
    ),
    on(
      QnaActions.deleteQna,
      (state): QnaState => ({ ...state, pendingDelete: true }),
    ),
    on(
      QnaActions.createQnaSuccess,
      QnaActions.getQnaSuccess,
      QnaActions.editQnaSuccess,
      QnaActions.deleteQnaSuccess,
      QnaActions.resetSelectedQna,
      HttpActions.clientError,
      RouterActions.routerRequest,
      (): QnaState => initialQnaState,
    ),
  ),
});
