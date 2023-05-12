import type {
  Organization,
  OrgMemberInviteNoUser,
  OrgMemberNoUser,
} from '@newbee/shared/util';
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
   * The organization the user is looking at right now.
   */
  selectedOrganization: OrgMemberNoUser | null;

  /**
   * The pending org member invites for the user, including:
   * - The token and role for the org member invite
   * - The name and slug of the organization the invite is attached to
   */
  invites: OrgMemberInviteNoUser[];
}

/**
 * The initial value for `OrganizationState`.
 */
export const initialOrganizationState: OrganizationState = {
  organizations: [],
  selectedOrganization: null,
  invites: [],
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
            userRelation: { organizations, selectedOrganization, invites },
          },
        }
      ): OrganizationState => ({
        ...state,
        organizations,
        selectedOrganization,
        invites,
      })
    ),
    on(
      AuthActions.loginSuccess,
      (
        state,
        { userRelation: { organizations, selectedOrganization, invites } }
      ): OrganizationState => ({
        ...state,
        organizations,
        selectedOrganization,
        invites,
      })
    ),
    on(
      CookieActions.initCookiesSuccess,
      (state, { csrfTokenAndDataDto: { userRelation } }): OrganizationState => {
        if (!userRelation) {
          return state;
        }

        const { organizations, selectedOrganization, invites } = userRelation;
        return { ...state, organizations, selectedOrganization, invites };
      }
    ),
    on(
      OrganizationActions.getAndSelectOrgSuccess,
      (state, { orgMember }): OrganizationState => ({
        ...state,
        selectedOrganization: orgMember,
      })
    )
  ),
});
