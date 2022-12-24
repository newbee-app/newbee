import { testBaseCsrfTokenDto1 } from '@newbee/shared/data-access';
import { CsrfActions } from './csrf.actions';
import { csrfFeature, CsrfState, initialCsrfState } from './csrf.reducer';

describe('CsrfReducer', () => {
  const stateAfterGetCsrfTokenSuccess: CsrfState = {
    ...initialCsrfState,
    csrfToken: testBaseCsrfTokenDto1.csrfToken,
  };
  describe('from initial state', () => {
    it('should not affect state for unknown action', () => {
      const action = { type: 'Unknown' };
      const updatedState = csrfFeature.reducer(initialCsrfState, action);
      expect(updatedState).toEqual(initialCsrfState);
    });

    it('should update state for getCsrfTokenSuccess', () => {
      const updatedState = csrfFeature.reducer(
        initialCsrfState,
        CsrfActions.getCsrfTokenSuccess({ csrfTokenDto: testBaseCsrfTokenDto1 })
      );
      expect(updatedState).toEqual(stateAfterGetCsrfTokenSuccess);
    });
  });
});
