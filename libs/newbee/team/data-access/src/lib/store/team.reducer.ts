import {
  HttpActions,
  RouterActions,
  TeamActions,
} from '@newbee/newbee/shared/data-access';
import {
  DocQueryResult,
  Keyword,
  PaginatedResults,
  QnaQueryResult,
} from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';

/**
 * Module-specific piece of state related to team.
 */
export interface TeamState {
  /**
   * Whether the user is waiting for a response for creating a team.
   */
  pendingCreate: boolean;

  /**
   * Whether the user is waiting for a response for editing a team.
   */
  pendingEdit: boolean;

  /**
   * Whether the user is waiting for a response for editing a team slug.
   */
  pendingEditSlug: boolean;

  /**
   * Whether the user is waiting for a response for deleting a team.
   */
  pendingDelete: boolean;

  /**
   * Whether the user is waiting for a response for checking a team slug.
   */
  pendingCheck: boolean;

  /**
   * Whether the user is waiting for a response for adding a new team member to the team.
   */
  pendingAddTeamMember: boolean;

  /**
   * Whether the user is waiting for a response for editing a team member in the team.
   */
  pendingEditTeamMember: Set<string>;

  /**
   * Whether the user is waiting for a response for deleting a team member from the team.
   */
  pendingDeleteTeamMember: Set<string>;

  /**
   * Whether a team slug is taken for creating a team.
   */
  slugTaken: boolean;

  /**
   * A generated value for a team's slug for creating a team.
   */
  generatedSlug: string;

  /**
   * All of the docs of the team as paginated results.
   */
  docs: PaginatedResults<DocQueryResult> | null;

  /**
   * All of the qnas of the team as paginated results.
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
 * The initial value for `TeamState`.
 */
export const initialTeamState: TeamState = {
  docs: null,
  qnas: null,
  pendingGetDocs: false,
  pendingGetQnas: false,
  pendingCreate: false,
  pendingEdit: false,
  pendingEditSlug: false,
  pendingDelete: false,
  pendingCheck: false,
  pendingAddTeamMember: false,
  pendingEditTeamMember: new Set(),
  pendingDeleteTeamMember: new Set(),
  slugTaken: false,
  generatedSlug: '',
};

/**
 * The reducers and generated selectors for `TeamState`.
 */
export const teamFeature = createFeature({
  name: `${Keyword.Team}Module`,
  reducer: createReducer(
    initialTeamState,
    on(
      TeamActions.createTeam,
      (state): TeamState => ({
        ...state,
        pendingCreate: true,
      }),
    ),
    on(
      TeamActions.editTeam,
      (state): TeamState => ({
        ...state,
        pendingEdit: true,
      }),
    ),
    on(
      TeamActions.editTeamSlug,
      (state): TeamState => ({
        ...state,
        pendingEditSlug: true,
      }),
    ),
    on(
      TeamActions.deleteTeam,
      (state): TeamState => ({
        ...state,
        pendingDelete: true,
      }),
    ),
    on(
      TeamActions.typingSlug,
      TeamActions.checkSlug,
      (state, { slug }): TeamState => ({
        ...state,
        pendingCheck: !!slug,
        slugTaken: false,
      }),
    ),
    on(
      TeamActions.checkSlugSuccess,
      (state, { slugTaken }): TeamState => ({
        ...state,
        slugTaken,
        pendingCheck: false,
      }),
    ),
    on(
      TeamActions.generateSlugSuccess,
      (state, { slug }): TeamState => ({
        ...state,
        generatedSlug: slug,
        pendingCheck: false,
        slugTaken: false,
      }),
    ),
    on(
      TeamActions.getDocs,
      (state): TeamState => ({
        ...state,
        pendingGetDocs: true,
      }),
    ),
    on(
      TeamActions.getDocsSuccess,
      (state, { docs }): TeamState => ({
        ...state,
        pendingGetDocs: false,
        docs,
      }),
    ),
    on(
      TeamActions.getQnas,
      (state): TeamState => ({
        ...state,
        pendingGetQnas: true,
      }),
    ),
    on(
      TeamActions.getQnasSuccess,
      (state, { qnas }): TeamState => ({
        ...state,
        pendingGetQnas: false,
        qnas,
      }),
    ),
    on(
      TeamActions.addTeamMember,
      (state): TeamState => ({
        ...state,
        pendingAddTeamMember: true,
      }),
    ),
    on(TeamActions.editTeamMember, (state, { orgMemberSlug }): TeamState => {
      const pendingEditTeamMember = new Set(state.pendingEditTeamMember);
      pendingEditTeamMember.add(orgMemberSlug);
      return { ...state, pendingEditTeamMember };
    }),
    on(TeamActions.deleteTeamMember, (state, { orgMemberSlug }): TeamState => {
      const pendingDeleteTeamMember = new Set(state.pendingDeleteTeamMember);
      pendingDeleteTeamMember.add(orgMemberSlug);
      return { ...state, pendingDeleteTeamMember };
    }),
    on(
      TeamActions.createTeamSuccess,
      TeamActions.editTeamSuccess,
      TeamActions.editTeamSlugSuccess,
      TeamActions.deleteTeamSuccess,
      TeamActions.addTeamMemberSuccess,
      TeamActions.editTeamMemberSuccess,
      TeamActions.deleteTeamMemberSuccess,
      HttpActions.clientError,
      RouterActions.routerRequest,
      (): TeamState => initialTeamState,
    ),
  ),
});
