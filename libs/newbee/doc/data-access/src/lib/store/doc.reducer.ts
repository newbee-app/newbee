import {
  DocActions,
  HttpActions,
  RouterActions,
} from '@newbee/newbee/shared/data-access';
import { canGetMoreResults } from '@newbee/newbee/shared/util';
import { DocQueryResult, Keyword, PaginatedResults } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';

/**
 * Module-specific piece of state related to docs.
 */
export interface DocState {
  /**
   * All of the docs of the org as paginated results.
   */
  docs: PaginatedResults<DocQueryResult> | null;

  /**
   * Whether the user is waiting for a response for getting all paginated docs.
   */
  pendingGetDocs: boolean;

  /**
   * Whether the user is waiting for a response for creating a doc.
   */
  pendingCreate: boolean;

  /**
   * Whether the user is waiting for a response for marking a doc up-to-date.
   */
  pendingUpToDate: boolean;

  /**
   * Whether the user is waiting for a response for editing a doc.
   */
  pendingEdit: boolean;

  /**
   * Whether the user is waiting for a response for deleting a doc.
   */
  pendingDelete: boolean;
}

/**
 * The initial value for `DocState`.
 */
export const initialDocState: DocState = {
  docs: null,
  pendingGetDocs: false,
  pendingCreate: false,
  pendingUpToDate: false,
  pendingEdit: false,
  pendingDelete: false,
};

/**
 * The reducers and generated selects for `DocState`.
 */
export const docFeature = createFeature({
  name: `${Keyword.Doc}Module`,
  reducer: createReducer(
    initialDocState,
    on(
      DocActions.getDocs,
      (state): DocState => ({
        ...state,
        pendingGetDocs: canGetMoreResults(state.docs),
      }),
    ),
    on(
      DocActions.getDocsSuccess,
      (state, { docs }): DocState => ({
        ...state,
        pendingGetDocs: false,
        docs: {
          ...docs,
          results: [...(state.docs?.results ?? []), ...docs.results],
        },
      }),
    ),
    on(
      DocActions.createDoc,
      (state): DocState => ({
        ...state,
        pendingCreate: true,
      }),
    ),
    on(
      DocActions.markDocAsUpToDate,
      (state): DocState => ({ ...state, pendingUpToDate: true }),
    ),
    on(
      DocActions.editDoc,
      (state): DocState => ({ ...state, pendingEdit: true }),
    ),
    on(
      DocActions.deleteDoc,
      (state): DocState => ({ ...state, pendingDelete: true }),
    ),
    on(
      DocActions.createDocSuccess,
      DocActions.getDocSuccess,
      DocActions.markDocAsUpToDateSuccess,
      DocActions.deleteDocSuccess,
      DocActions.resetSelectedDoc,
      HttpActions.clientError,
      RouterActions.routerRequest,
      (): DocState => initialDocState,
    ),
  ),
});
