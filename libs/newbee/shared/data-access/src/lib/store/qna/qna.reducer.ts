import { Keyword, QnaNoOrg, TeamMember } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';
import { QnaActions } from './qna.actions';

/**
 * The piece of state holding qna information that's useful app-wide.
 */
export interface QnaState {
  /**
   * The qna the user is looking at right now.
   */
  selectedQna: QnaNoOrg | null;

  /**
   * The user's role in the qna's team, if any.
   */
  teamMember: TeamMember | null;
}

/**
 * The initial value for `QnaState`.
 */
export const initialQnaState: QnaState = {
  selectedQna: null,
  teamMember: null,
};

/**
 * The reducers and generated selectors for `QnaState`.
 */
export const qnaFeature = createFeature({
  name: Keyword.Qna,
  reducer: createReducer(
    initialQnaState,
    on(
      QnaActions.getQnaSuccess,
      (state, { qnaAndMemberDto }): QnaState => ({
        ...state,
        selectedQna: qnaAndMemberDto.qna,
        teamMember: qnaAndMemberDto.teamMember,
      }),
    ),
    on(
      QnaActions.markQnaAsUpToDateSuccess,
      (state, { newQna, oldSlug }): QnaState => {
        const { selectedQna } = state;
        if (!selectedQna || selectedQna.qna.slug !== oldSlug) {
          return state;
        }

        return { ...state, selectedQna: { ...selectedQna, qna: newQna } };
      },
    ),
    on(QnaActions.resetSelectedQna, (): QnaState => initialQnaState),
  ),
});
