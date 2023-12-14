import {
  httpFeature,
  organizationFeature,
  qnaFeature,
} from '@newbee/newbee/shared/data-access';
import { createSelector } from '@ngrx/store';

/**
 * A selector for selecting the currently selected qna and organization.
 */
export const selectQnaAndOrg = createSelector(
  qnaFeature.selectSelectedQna,
  organizationFeature.selectSelectedOrganization,
  (selectedQna, selectedOrganization) => ({
    selectedQna,
    selectedOrganization,
  }),
);

/**
 * A selector for selecting the currently selected qna and screen error.
 */
export const selectQnaAndScreenError = createSelector(
  qnaFeature.selectSelectedQna,
  httpFeature.selectScreenError,
  (selectedQna, screenError) => ({ selectedQna, screenError }),
);

/**
 * A selector for the qna and org states.
 */
export const selectQnaAndOrgStates = createSelector(
  qnaFeature.selectQnaState,
  organizationFeature.selectOrgState,
  (qnaState, orgState) => ({ qnaState, orgState }),
);
