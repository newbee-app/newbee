import {
  HttpActions,
  OrganizationActions,
} from '@newbee/newbee/shared/data-access';
import { createFeature, createReducer, on } from '@ngrx/store';

/**
 * Module-specific piece of state related to organization.
 */
export interface OrganizationState {
  /**
   * Whether the user is waiting for a response for creating an org.
   */
  pendingCreate: boolean;

  /**
   * Whether the user is waitig for a response for checking an org slug.
   */
  pendingCheck: boolean;

  /**
   * Whether an org slug is taken for creating an org.
   */
  slugTaken: boolean;

  /**
   * A generated value for an org's slug for creating an org.
   */
  generatedSlug: string;
}

/**
 * The initial value for `OrganizationState`.
 */
export const initialOrganizationState: OrganizationState = {
  pendingCreate: false,
  pendingCheck: false,
  slugTaken: false,
  generatedSlug: '',
};

/**
 * The reducers and generated selectors for `OrganizationState`.
 */
export const organizationFeature = createFeature({
  name: 'organizationModule',
  reducer: createReducer(
    initialOrganizationState,
    on(
      OrganizationActions.createOrg,
      (state): OrganizationState => ({
        ...state,
        pendingCreate: true,
      })
    ),
    on(
      OrganizationActions.checkSlug,
      (state, { slug }): OrganizationState => ({
        ...state,
        pendingCheck: !!slug,
        slugTaken: false,
      })
    ),
    on(
      OrganizationActions.checkSlugSuccess,
      (state, { slugTaken }): OrganizationState => ({
        ...state,
        slugTaken,
        pendingCheck: false,
      })
    ),
    on(
      OrganizationActions.generateSlugSuccess,
      (state, { slug }): OrganizationState => ({
        ...state,
        generatedSlug: slug,
        pendingCheck: false,
        slugTaken: false,
      })
    ),
    on(
      OrganizationActions.createOrgSuccess,
      OrganizationActions.orgCreateComponentInit,
      HttpActions.clientError,
      (): OrganizationState => initialOrganizationState
    )
  ),
});
