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
   * Whether the user is waiting for a response for creating a QnA.
   */
  pendingCreate: boolean;

  /**
   * Whether the user is waiting for a response for marking a qna up-to-date.
   */
  pendingUpToDate: boolean;
}

/**
 * The initial value for `QnaState`.
 */
export const initialQnaState: QnaState = {
  pendingCreate: false,
  pendingUpToDate: false,
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
