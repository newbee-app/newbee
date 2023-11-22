import { DocActions } from '@newbee/newbee/shared/data-access';
import { DocState, docFeature, initialDocState } from './doc.reducer';

describe('DocReducer', () => {
  const stateAfterCreateDoc: DocState = {
    ...initialDocState,
    pendingCreate: true,
  };

  describe('from initial state', () => {
    it('should update state for createDoc', () => {
      const updatedState = docFeature.reducer(
        initialDocState,
        DocActions.createDoc,
      );
      expect(updatedState).toEqual(stateAfterCreateDoc);
    });
  });

  describe('from altered state', () => {
    it('should update state for createDocSuccess', () => {
      const updatedState = docFeature.reducer(
        stateAfterCreateDoc,
        DocActions.createDocSuccess,
      );
      expect(updatedState).toEqual(initialDocState);
    });
  });
});
