import {
  BaseCreateQnaDto,
  BaseQnaAndMemberDto,
  Keyword,
  Qna,
  Team,
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
    'Create Qna': props<{
      createQnaDto: BaseCreateQnaDto;
      team: Team | null;
    }>(),

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
     * Indicates that a qna was successfully marked as up-to-date.
     */
    'Mark Qna As Up To Date Success': props<{ oldSlug: string; newQna: Qna }>(),

    /**
     * Reset the selected qna.
     */
    'Reset Selected Qna': emptyProps(),
  },
});
