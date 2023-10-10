import { BaseCreateQnaDto } from '@newbee/shared/data-access';
import { Keyword, Qna, Team } from '@newbee/shared/util';
import { createActionGroup, props } from '@ngrx/store';

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
  },
});
