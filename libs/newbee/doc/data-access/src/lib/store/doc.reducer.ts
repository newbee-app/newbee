import {
  DocActions,
  HttpActions,
  RouterActions,
} from '@newbee/newbee/shared/data-access';
import { Keyword } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';

/**
 * Module-specific piece of state related to docs.
 */
export interface DocState {
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
      DocActions.editDocSuccess,
      DocActions.deleteDocSuccess,
      DocActions.resetSelectedDoc,
      HttpActions.clientError,
      RouterActions.routerRequest,
      (): DocState => initialDocState,
    ),
  ),
});
