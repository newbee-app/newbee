import {
  HttpActions,
  OrgMemberActions,
  RouterActions,
} from '@newbee/newbee/shared/data-access';
import { Keyword } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';

/**
 * Module-specific piece of state related to org members.
 */
export interface OrgMemberState {
  /**
   * Whether the user is waiting for a response for editing an org member.
   */
  pendingEdit: boolean;

  /**
   * Whether the user is waiting for a response for deleting an org member.
   */
  pendingDelete: boolean;
}

/**
 * The initial value for `OrgMemberState`.
 */
export const initialOrgMemberState: OrgMemberState = {
  pendingEdit: false,
  pendingDelete: false,
};

/**
 * The reducers and generated selectors for `OrgMemberState`.
 */
export const orgMemberFeature = createFeature({
  name: `${Keyword.Member}Module`,
  reducer: createReducer(
    initialOrgMemberState,
    on(
      OrgMemberActions.editOrgMember,
      (state): OrgMemberState => ({ ...state, pendingEdit: true })
    ),
    on(
      OrgMemberActions.deleteOrgMember,
      (state): OrgMemberState => ({ ...state, pendingDelete: true })
    ),
    on(
      OrgMemberActions.editOrgMemberSuccess,
      OrgMemberActions.deleteOrgMemberSuccess,
      HttpActions.clientError,
      RouterActions.routerRequest,
      (): OrgMemberState => initialOrgMemberState
    )
  ),
});
