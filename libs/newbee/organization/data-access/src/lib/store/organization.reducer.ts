import {
  AppActions,
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
}

/**
 * The initial value for `OrganizationState`.
 */
export const initialOrganizationState: OrganizationState = {
  pendingCreate: false,
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
      OrganizationActions.createOrgSuccess,
      HttpActions.clientError,
      AppActions.resetPendingActions,
      (): OrganizationState => initialOrganizationState
    )
  ),
});
