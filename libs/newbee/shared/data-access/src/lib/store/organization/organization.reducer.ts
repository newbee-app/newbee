import type { Organization, OrgMemberNoUser } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from '../auth';
import { CookieActions } from '../cookie';
import { OrganizationActions } from './organization.actions';

/**
 * The piece of state holding organization information that's useful app-wide.
 */
export interface OrganizationState {
  /**
   * The names and slugs of the organizations the user is a part of.
   */
  organizations: Organization[];

  /**
   * The organization the user is looking at right now and their relation to it.
   */
  selectedOrganization: OrgMemberNoUser | null;
}

/**
 * The initial value for `OrganizationState`.
 */
export const initialOrganizationState: OrganizationState = {
  organizations: [],
  selectedOrganization: null,
};

/**
 * The reducers and generated selectors for `OrganizationState`.
 */
export const organizationFeature = createFeature({
  name: 'organization',
  reducer: createReducer(
    initialOrganizationState,
    on(
      AuthActions.registerWithWebauthnSuccess,
      (
        state,
        {
          userRelationAndOptionsDto: {
            userRelation: { organizations },
          },
        }
      ): OrganizationState => ({
        ...state,
        organizations,
      })
    ),
    on(
      AuthActions.loginSuccess,
      (state, { userRelation: { organizations } }): OrganizationState => ({
        ...state,
        organizations,
      })
    ),
    on(
      CookieActions.initCookiesSuccess,
      (state, { csrfTokenAndDataDto: { userRelation } }): OrganizationState => {
        if (!userRelation) {
          return state;
        }

        const { organizations } = userRelation;
        return { ...state, organizations };
      }
    ),
    on(
      OrganizationActions.getOrgSuccess,
      (state, { orgMember }): OrganizationState => {
        return {
          ...state,
          selectedOrganization: orgMember,
        };
      }
    ),
    on(
      OrganizationActions.createOrgSuccess,
      (state, { organization }): OrganizationState => {
        const organizations = [...state.organizations, organization];
        return { ...state, organizations };
      }
    ),
    on(OrganizationActions.resetSelectedOrg, (state): OrganizationState => {
      return { ...state, selectedOrganization: null };
    })
  ),
});
