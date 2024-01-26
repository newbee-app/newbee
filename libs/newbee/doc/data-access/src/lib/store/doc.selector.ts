import {
  docFeature,
  httpFeature,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import { createSelector } from '@ngrx/store';
import { docFeature as docModuleFeature } from './doc.reducer';

/**
 * A selector for selecting the currently selected doc and organization.
 */
export const selectDocAndOrg = createSelector(
  docFeature.selectSelectedDoc,
  organizationFeature.selectSelectedOrganization,
  (selectedDoc, selectedOrganization) => ({
    selectedDoc,
    selectedOrganization,
  }),
);

/**
 * A selector for selecting the loaded docs, currently selected organization, and error.
 */
export const selectDocsOrgAndError = createSelector(
  docModuleFeature.selectDocs,
  organizationFeature.selectSelectedOrganization,
  httpFeature.selectError,
  (docs, selectedOrganization, error) => ({
    docs,
    selectedOrganization,
    error,
  }),
);

/**
 * A selector for selecting the currently selected doc and screen error.
 */
export const selectDocAndScreenError = createSelector(
  docFeature.selectSelectedDoc,
  httpFeature.selectScreenError,
  (selectedDoc, screenError) => ({ selectedDoc, screenError }),
);

/**
 * A selector for selecting the currently selected doc and org states.
 */
export const selectDocAndOrgStates = createSelector(
  docFeature.selectDocState,
  organizationFeature.selectOrgState,
  (docState, orgState) => ({ docState, orgState }),
);
