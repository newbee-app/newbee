import {
  DocActions,
  HttpActions,
  RouterActions,
} from '@newbee/newbee/shared/data-access';
import { DocState, docFeature, initialDocState } from './doc.reducer';

describe('DocReducer', () => {
  const stateAfterCreateDoc: DocState = {
    ...initialDocState,
    pendingCreate: true,
  };
  const stateAfterMarkDocAsUpToDate: DocState = {
    ...initialDocState,
    pendingUpToDate: true,
  };

  describe('from initial state', () => {
    it('should update state for createDoc', () => {
      const updatedState = docFeature.reducer(
        initialDocState,
        DocActions.createDoc,
      );
      expect(updatedState).toEqual(stateAfterCreateDoc);
    });

    it('should update state for markDocAsUpToDate', () => {
      const updatedState = docFeature.reducer(
        initialDocState,
        DocActions.markDocAsUpToDate,
      );
      expect(updatedState).toEqual(stateAfterMarkDocAsUpToDate);
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

    it('should update state for editDocSuccess', () => {
      const updatedState = docFeature.reducer(
        stateAfterMarkDocAsUpToDate,
        DocActions.editDocSuccess,
      );
      expect(updatedState).toEqual(initialDocState);
    });

    it('should update state for resetSelectedDoc', () => {
      const updatedState = docFeature.reducer(
        stateAfterCreateDoc,
        DocActions.resetSelectedDoc,
      );
      expect(updatedState).toEqual(initialDocState);
    });

    it('should update state for clientError', () => {
      const updatedState = docFeature.reducer(
        stateAfterCreateDoc,
        HttpActions.clientError,
      );
      expect(updatedState).toEqual(initialDocState);
    });

    it('should update state for routerRequest', () => {
      const updatedState = docFeature.reducer(
        stateAfterCreateDoc,
        RouterActions.routerRequest,
      );
      expect(updatedState).toEqual(initialDocState);
    });
  });
});
