import {
  BaseCreateDocDto,
  BaseDocAndMemberDto,
  Doc,
  Keyword,
} from '@newbee/shared/util';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

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

    /**
     * Gets a doc using the given slug.
     */
    'Get Doc': props<{ slug: string }>(),

    /**
     * Indicates that a doc was successfully retrieved.
     */
    'Get Doc Success': props<{ docAndMemberDto: BaseDocAndMemberDto }>(),

    /**
     * Mark the selected doc as up-to-date.
     */
    'Mark Doc As Up To Date': emptyProps(),

    /**
     * Indicates that a doc was successfully edited.
     */
    'Edit Doc Success': props<{ doc: Doc }>(),

    /**
     * Reset the selected doc.
     */
    'Reset Selected Doc': emptyProps(),
  },
});
