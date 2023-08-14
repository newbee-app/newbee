import { Keyword, OrgMemberNoOrg } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';
import { OrgMemberActions } from './org-member.actions';

/**
 * The piece of state holding org member information that's useful app-wide.
 */
export interface OrgMemberState {
  /**
   * The org member the user is looking at right now.
   */
  selectedOrgMember: OrgMemberNoOrg | null;
}

/**
 * The initial value for `OrgMemberState`.
 */
export const initialOrgMemberState: OrgMemberState = {
  selectedOrgMember: null,
};

/**
 * The reducers and generated selectors for `OrgMemberState`.
 */
export const orgMemberFeature = createFeature({
  name: Keyword.Member,
  reducer: createReducer(
    initialOrgMemberState,
    on(
      OrgMemberActions.getOrgMemberSuccess,
      (state, { orgMember }): OrgMemberState => ({
        ...state,
        selectedOrgMember: orgMember,
      })
    ),
    on(
      OrgMemberActions.editOrgMemberSuccess,
      (state, { orgMember }): OrgMemberState => {
        const { selectedOrgMember } = state;
        if (!selectedOrgMember) {
          return state;
        }

        return {
          ...state,
          selectedOrgMember: {
            ...selectedOrgMember,
            orgMember,
          },
        };
      }
    ),
    on(
      OrgMemberActions.deleteOrgMemberSuccess,
      OrgMemberActions.resetSelectedOrgMember,
      (): OrgMemberState => initialOrgMemberState
    )
  ),
});
