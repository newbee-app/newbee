import {
  HttpActions,
  RouterActions,
  TeamActions,
} from '@newbee/newbee/shared/data-access';
import { Keyword } from '@newbee/shared/util';
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
   * Whether a team slug is taken for creating a team.
   */
  slugTaken: boolean;

  /**
   * A generated value for a team's slug for creating a team.
   */
  generatedSlug: string;
}

/**
 * The initial value for `TeamState`.
 */
export const initialTeamState: TeamState = {
  pendingCreate: false,
  pendingEdit: false,
  pendingEditSlug: false,
  pendingDelete: false,
  pendingCheck: false,
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
      })
    ),
    on(
      TeamActions.editTeam,
      (state): TeamState => ({
        ...state,
        pendingEdit: true,
      })
    ),
    on(
      TeamActions.editTeamSlug,
      (state): TeamState => ({
        ...state,
        pendingEditSlug: true,
      })
    ),
    on(
      TeamActions.deleteTeam,
      (state): TeamState => ({
        ...state,
        pendingDelete: true,
      })
    ),
    on(
      TeamActions.typingSlug,
      TeamActions.checkSlug,
      (state, { slug }): TeamState => ({
        ...state,
        pendingCheck: !!slug,
        slugTaken: false,
      })
    ),
    on(
      TeamActions.checkSlugSuccess,
      (state, { slugTaken }): TeamState => ({
        ...state,
        slugTaken,
        pendingCheck: false,
      })
    ),
    on(
      TeamActions.generateSlugSuccess,
      (state, { slug }): TeamState => ({
        ...state,
        generatedSlug: slug,
        pendingCheck: false,
        slugTaken: false,
      })
    ),
    on(
      TeamActions.createTeamSuccess,
      TeamActions.editTeamSuccess,
      TeamActions.editTeamSlugSuccess,
      TeamActions.deleteTeamSuccess,
      HttpActions.clientError,
      RouterActions.routerRequest,
      (): TeamState => initialTeamState
    )
  ),
});
