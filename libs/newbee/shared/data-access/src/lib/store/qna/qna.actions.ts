import {
  BaseCreateQnaDto,
  BaseQnaAndMemberDto,
  BaseUpdateAnswerDto,
  BaseUpdateQuestionDto,
  Keyword,
  Qna,
} from '@newbee/shared/util';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

/**
 * All actions tied to QnAs.
 */
export const QnaActions = createActionGroup({
  source: Keyword.Qna,
  events: {
    /**
     * Creates a QnA using the given information.
     */
    'Create Qna': props<{ createQnaDto: BaseCreateQnaDto }>(),

    /**
     * Indicates that a QnA was successfully created.
     */
    'Create Qna Success': props<{ qna: Qna }>(),

    /**
     * Gets a qna using the given information.
     */
    'Get Qna': props<{ slug: string }>(),

    /**
     * Indicates that a qna was successfully retrieved.
     */
    'Get Qna Success': props<{ qnaAndMemberDto: BaseQnaAndMemberDto }>(),

    /**
     * Mark the selected qna as up-to-date.
     */
    'Mark Qna As Up To Date': emptyProps(),

    /**
     * Edit the question portion of the currently selected qna.
     */
    'Edit Question': props<{ updateQuestionDto: BaseUpdateQuestionDto }>(),

    /**
     * Edit the answer portion of the currently selected qna.
     */
    'Edit Answer': props<{ updateAnswerDto: BaseUpdateAnswerDto }>(),

    /**
     * Indicates that the qna was successfully edited.
     */
    'Edit Qna Success': props<{ qna: Qna }>(),

    /**
     * Delete the currently selected qna.
     */
    'Delete Qna': emptyProps(),

    /**
     * Indicates that a qna was successfully deleted.
     */
    'Delete Qna Success': emptyProps(),

    /**
     * Reset the selected qna.
     */
    'Reset Selected Qna': emptyProps(),
  },
});
