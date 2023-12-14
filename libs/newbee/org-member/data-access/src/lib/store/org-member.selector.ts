import {
  httpFeature,
  orgMemberFeature,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import { createSelector } from '@ngrx/store';

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
