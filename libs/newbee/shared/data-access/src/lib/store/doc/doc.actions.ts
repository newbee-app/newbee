import {
  BaseCreateDocDto,
  BaseDocAndMemberDto,
  BaseUpdateDocDto,
  Doc,
  DocQueryResult,
  Keyword,
  PaginatedResults,
} from '@newbee/shared/util';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

/**
 * All actions tied to docs.
 */
export const DocActions = createActionGroup({
  source: Keyword.Doc,
  events: {
    /**
     * Gets all of the paginated docs of the selected org.
     */
    'Get Docs': emptyProps(),

    /**
     * Indicates that the get docs action is pending.
     */
    'Get Docs Pending': emptyProps(),

    /**
     * Indicates that the paginated docs were successfully retrieved.
     */
    'Get Docs Success': props<{ docs: PaginatedResults<DocQueryResult> }>(),

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
     * Indicates that a doc was successfully marked up-to-date.
     */
    'Mark Doc As Up To Date Success': props<{ doc: Doc }>(),

    /**
     * Edit the currently selected doc.
     */
    'Edit Doc': props<{ updateDocDto: BaseUpdateDocDto }>(),

    /**
     * Delete the currently selected doc.
     */
    'Delete Doc': emptyProps(),

    /**
     * Indicates that a doc was successfully deleted.
     */
    'Delete Doc Success': emptyProps(),

    /**
     * Reset the selected doc.
     */
    'Reset Selected Doc': emptyProps(),

    /**
     * Reset pending state fields.
     */
    'Reset Pending': emptyProps(),
  },
});
