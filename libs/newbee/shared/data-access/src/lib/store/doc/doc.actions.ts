import { BaseCreateDocDto, Doc, Keyword } from '@newbee/shared/util';
import { createActionGroup, props } from '@ngrx/store';

/**
 * All actions tied to docs.
 */
export const DocActions = createActionGroup({
  source: Keyword.Doc,
  events: {
    /**
     * Creates a doc using the given information.
     */
    'Create Doc': props<{ createDocDto: BaseCreateDocDto }>(),

    /**
     * Indicates that a doc was successfully created.
     */
    'Create Doc Success': props<{ doc: Doc }>(),
  },
});
