import {
  httpFeature,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import { createSelector } from '@ngrx/store';

/**
 * Select the currently selected org and screen error.
 */
export const selectOrgAndScreenError = createSelector(
  organizationFeature.selectSelectedOrganization,
  httpFeature.selectScreenError,
  (selectedOrganization, screenError) => ({
    selectedOrganization,
    screenError,
  }),
);
