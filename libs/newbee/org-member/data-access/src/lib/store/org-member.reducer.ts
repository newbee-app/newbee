import {
  HttpActions,
  OrgMemberActions,
  RouterActions,
} from '@newbee/newbee/shared/data-access';
import { canGetMoreResults } from '@newbee/newbee/shared/util';
import {
  DocQueryResult,
  Keyword,
  PaginatedResults,
  QnaQueryResult,
} from '@newbee/shared/util';
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

  /**
   * Whether the user is waiting for a response for inviting a user.
   */
  pendingInvite: boolean;

  /**
   * All of the docs of the org member as paginated results.
   */
  docs: PaginatedResults<DocQueryResult> | null;

  /**
   * All of the qnas of the org member as paginated results.
   */
  qnas: PaginatedResults<QnaQueryResult> | null;

  /**
   * Whether the user is waiting for a response for getting all paginated docs.
   */
  pendingGetDocs: boolean;

  /**
   * Whether the user is waiting for a response for getting all paginated qnas.
   */
  pendingGetQnas: boolean;
}

/**
 * The initial value for `OrgMemberState`.
 */
export const initialOrgMemberState: OrgMemberState = {
  pendingEdit: false,
  pendingDelete: false,
  pendingInvite: false,
  docs: null,
  qnas: null,
  pendingGetDocs: false,
  pendingGetQnas: false,
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
      (state): OrgMemberState => ({ ...state, pendingEdit: true }),
    ),
    on(
      OrgMemberActions.deleteOrgMember,
      (state): OrgMemberState => ({ ...state, pendingDelete: true }),
    ),
    on(
      OrgMemberActions.getDocs,
      (state): OrgMemberState => ({
        ...state,
        pendingGetDocs: canGetMoreResults(state.docs),
      }),
    ),
    on(
      OrgMemberActions.getDocsSuccess,
      (state, { docs }): OrgMemberState => ({
        ...state,
        pendingGetDocs: false,
        docs: {
          ...docs,
          results: [...(state.docs?.results ?? []), ...docs.results],
        },
      }),
    ),
    on(
      OrgMemberActions.getQnas,
      (state): OrgMemberState => ({
        ...state,
        pendingGetQnas: canGetMoreResults(state.qnas),
      }),
    ),
    on(
      OrgMemberActions.getQnasSuccess,
      (state, { qnas }): OrgMemberState => ({
        ...state,
        pendingGetQnas: false,
        qnas: {
          ...qnas,
          results: [...(state.qnas?.results ?? []), ...qnas.results],
        },
      }),
    ),
    on(
      OrgMemberActions.inviteUser,
      (state): OrgMemberState => ({ ...state, pendingInvite: true }),
    ),
    on(
      OrgMemberActions.editOrgMemberSuccess,
      OrgMemberActions.deleteOrgMemberSuccess,
      OrgMemberActions.inviteUserSuccess,
      HttpActions.clientError,
      RouterActions.routerRequest,
      (): OrgMemberState => initialOrgMemberState,
    ),
  ),
});
