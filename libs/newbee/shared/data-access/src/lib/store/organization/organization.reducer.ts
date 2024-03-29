import {
  Keyword,
  Organization,
  OrgMemberNoUserOrg,
  OrgTeamsMembers,
} from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';
import { isEqual } from 'lodash-es';
import { AuthActions } from '../auth';
import { CookieActions } from '../cookie';
import { InviteActions } from '../invite';
import { TeamActions } from '../team';
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
  selectedOrganization: OrgTeamsMembers | null;

  /**
   * The user's relation to the selected organization, if they have any.
   */
  orgMember: OrgMemberNoUserOrg | null;
}

/**
 * The initial value for `OrganizationState`.
 */
export const initialOrganizationState: OrganizationState = {
  organizations: [],
  selectedOrganization: null,
  orgMember: null,
};

/**
 * The reducers and generated selectors for `OrganizationState`.
 */
export const organizationFeature = createFeature({
  name: Keyword.Organization,
  reducer: createReducer(
    initialOrganizationState,
    on(
      AuthActions.registerWithWebAuthnSuccess,
      (
        state,
        {
          userRelationAndOptionsDto: {
            userRelation: { organizations },
          },
        },
      ): OrganizationState => ({
        ...state,
        organizations,
      }),
    ),
    on(
      AuthActions.loginSuccess,
      (state, { userRelation: { organizations } }): OrganizationState => ({
        ...state,
        organizations,
      }),
    ),
    on(
      CookieActions.initCookiesSuccess,
      (state, { csrfTokenAndDataDto: { userRelation } }): OrganizationState => {
        if (!userRelation) {
          return state;
        }

        const { organizations } = userRelation;
        return { ...state, organizations };
      },
    ),
    on(
      OrganizationActions.getOrgSuccess,
      (
        state,
        { orgAndMemberDto: { organization, orgMember } },
      ): OrganizationState => ({
        ...state,
        selectedOrganization: organization,
        orgMember,
      }),
    ),
    on(
      OrganizationActions.createOrgSuccess,
      (state, { organization }): OrganizationState => {
        const organizations = [...state.organizations, organization];
        return { ...state, organizations };
      },
    ),
    on(
      OrganizationActions.editOrgSuccess,
      OrganizationActions.editOrgSlugSuccess,
      (state, { newOrg }): OrganizationState => {
        const { selectedOrganization } = state;

        // this shouldn't happen
        if (!selectedOrganization) {
          return state;
        }

        const organizations = [
          ...state.organizations.filter(
            (org) => !isEqual(org, selectedOrganization.organization),
          ),
          newOrg,
        ];

        return {
          ...state,
          organizations,
          selectedOrganization: {
            ...selectedOrganization,
            organization: newOrg,
          },
        };
      },
    ),
    on(OrganizationActions.deleteOrgSuccess, (state): OrganizationState => {
      const { selectedOrganization } = state;

      // this shouldn't happen
      if (!selectedOrganization) {
        return state;
      }

      const organizations = state.organizations.filter(
        (org) => !isEqual(org, selectedOrganization.organization),
      );

      return {
        ...state,
        organizations,
        selectedOrganization: null,
        orgMember: null,
      };
    }),
    on(
      OrganizationActions.resetSelectedOrg,
      (state): OrganizationState => ({
        ...state,
        selectedOrganization: null,
        orgMember: null,
      }),
    ),
    on(
      InviteActions.acceptInviteSuccess,
      (state, { orgMember: { organization } }): OrganizationState => ({
        ...state,
        organizations: [...state.organizations, organization],
      }),
    ),
    on(
      TeamActions.createTeamSuccess,
      (state, { organization, team }): OrganizationState => {
        const { selectedOrganization } = state;
        if (selectedOrganization?.organization.slug !== organization.slug) {
          return state;
        }

        return {
          ...state,
          selectedOrganization: {
            ...selectedOrganization,
            teams: [...selectedOrganization.teams, team],
          },
        };
      },
    ),
    on(
      TeamActions.editTeamSuccess,
      TeamActions.editTeamSlugSuccess,
      (state, { oldSlug, newTeam }): OrganizationState => {
        const { selectedOrganization } = state;
        if (!selectedOrganization) {
          return state;
        }

        return {
          ...state,
          selectedOrganization: {
            ...selectedOrganization,
            teams: selectedOrganization.teams.map((team) => {
              if (oldSlug === team.slug) {
                return newTeam;
              }

              return team;
            }),
          },
        };
      },
    ),
    on(TeamActions.deleteTeamSuccess, (state, { slug }): OrganizationState => {
      const { selectedOrganization } = state;
      if (!selectedOrganization) {
        return state;
      }

      return {
        ...state,
        selectedOrganization: {
          ...selectedOrganization,
          teams: selectedOrganization.teams.filter(
            (team) => team.slug !== slug,
          ),
        },
      };
    }),
  ),
});
