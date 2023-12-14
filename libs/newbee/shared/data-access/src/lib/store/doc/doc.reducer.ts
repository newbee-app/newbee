import { DocNoOrg, Keyword, TeamMember } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';
import { DocActions } from './doc.actions';

/**
 * The piece of state holding doc information that's useful app-wide.
 */
export interface DocState {
  /**
   * The doc the user is looking at right now.
   */
  selectedDoc: DocNoOrg | null;

  /**
   * The user's role in the doc's team, if any.
   */
  teamMember: TeamMember | null;
}

/**
 * The initial value for `DocState`.
 */
export const initialDocState: DocState = {
  selectedDoc: null,
  teamMember: null,
};

/**
 * The reducers and generated selectors for `DocState`.
 */
export const docFeature = createFeature({
  name: Keyword.Doc,
  reducer: createReducer(
    initialDocState,
    on(
      DocActions.getDocSuccess,
      (state, { docAndMemberDto }): DocState => ({
        ...state,
        selectedDoc: docAndMemberDto.doc,
        teamMember: docAndMemberDto.teamMember,
      }),
    ),
    on(DocActions.markDocAsUpToDateSuccess, (state, { doc }): DocState => {
      const { selectedDoc } = state;
      if (!selectedDoc || selectedDoc.doc.slug !== doc.slug) {
        return state;
      }

      return { ...state, selectedDoc: { ...selectedDoc, doc } };
    }),
    on(
      DocActions.deleteDocSuccess,
      DocActions.resetSelectedDoc,
      (): DocState => initialDocState,
    ),
  ),
});
