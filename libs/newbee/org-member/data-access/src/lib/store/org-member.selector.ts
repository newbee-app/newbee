import {
  httpFeature,
  orgMemberFeature,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import { createSelector } from '@ngrx/store';
import { orgMemberFeature as orgMemberModuleFeature } from './org-member.reducer';

/**
 * A selector for selecting the currently selected org member and org.
 */
export const selectOrgMemberAndOrg = createSelector(
  orgMemberFeature.selectSelectedOrgMember,
  organizationFeature.selectSelectedOrganization,
  (selectedOrgMember, selectedOrganization) => ({
    selectedOrgMember,
    selectedOrganization,
  }),
);

/**
 * A selector for the org member and screen error.
 */
export const selectOrgMemberAndScreenError = createSelector(
  orgMemberFeature.selectSelectedOrgMember,
  httpFeature.selectScreenError,
  (selectedOrgMember, screenError) => ({ selectedOrgMember, screenError }),
);

/**
 * A selector for the org member's posts, currently selected org member, currently selected org, and error.
 */
export const selectOrgMemberPostsOrgAndError = createSelector(
  orgMemberModuleFeature.selectDocs,
  orgMemberModuleFeature.selectQnas,
  orgMemberFeature.selectSelectedOrgMember,
  organizationFeature.selectSelectedOrganization,
  httpFeature.selectError,
  (docs, qnas, selectedOrgMember, selectedOrganization, error) => ({
    docs,
    qnas,
    selectedOrgMember,
    selectedOrganization,
    error,
  }),
);
