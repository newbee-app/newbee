import {
  DocActions,
  HttpActions,
  RouterActions,
} from '@newbee/newbee/shared/data-access';
import { testPaginatedResultsDocQueryResult1 } from '@newbee/shared/util';
import { DocState, docFeature, initialDocState } from './doc.reducer';

describe('DocReducer', () => {
  const stateAfterGetDocs: DocState = {
    ...initialDocState,
    pendingGetDocs: true,
  };
  const stateAfterGetDocsSuccess: DocState = {
    ...initialDocState,
    docs: testPaginatedResultsDocQueryResult1,
  };
  const stateAfterCreateDoc: DocState = {
    ...initialDocState,
    pendingCreate: true,
  };
  const stateAfterMarkDocAsUpToDate: DocState = {
    ...initialDocState,
    pendingUpToDate: true,
  };
  const stateAfterEditDoc: DocState = {
    ...initialDocState,
    pendingEdit: true,
  };
  const stateAfterDeleteDoc: DocState = {
    ...initialDocState,
    pendingDelete: true,
  };

  describe('from initial state', () => {
    it('should update state for getDocs', () => {
      let updatedState = docFeature.reducer(
        initialDocState,
        DocActions.getDocs,
      );
      expect(updatedState).toEqual(stateAfterGetDocs);

      updatedState = docFeature.reducer(
        stateAfterGetDocsSuccess,
        DocActions.getDocs,
      );
      expect(updatedState).toEqual(stateAfterGetDocsSuccess);
    });

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

    it('should update state for editDoc', () => {
      const updatedState = docFeature.reducer(
        initialDocState,
        DocActions.editDoc,
      );
      expect(updatedState).toEqual(stateAfterEditDoc);
    });

    it('should update state after deleteDoc', () => {
      const updatedState = docFeature.reducer(
        initialDocState,
        DocActions.deleteDoc,
      );
      expect(updatedState).toEqual(stateAfterDeleteDoc);
    });
  });

  describe('from altered state', () => {
    it('should update state for getDocsSuccess', () => {
      let updatedState = docFeature.reducer(
        stateAfterGetDocs,
        DocActions.getDocsSuccess({
          docs: testPaginatedResultsDocQueryResult1,
        }),
      );
      expect(updatedState).toEqual({
        ...initialDocState,
        docs: testPaginatedResultsDocQueryResult1,
      });

      updatedState = docFeature.reducer(
        stateAfterGetDocsSuccess,
        DocActions.getDocsSuccess({
          docs: testPaginatedResultsDocQueryResult1,
        }),
      );
      expect(updatedState).toEqual({
        ...stateAfterGetDocsSuccess,
        docs: {
          ...testPaginatedResultsDocQueryResult1,
          results: [
            ...testPaginatedResultsDocQueryResult1.results,
            ...testPaginatedResultsDocQueryResult1.results,
          ],
        },
      });
    });

    it('should update state for createDocSuccess', () => {
      const updatedState = docFeature.reducer(
        stateAfterCreateDoc,
        DocActions.createDocSuccess,
      );
      expect(updatedState).toEqual(initialDocState);
    });

    it('should update state for getDocSuccess', () => {
      const updatedState = docFeature.reducer(
        stateAfterEditDoc,
        DocActions.getDocSuccess,
      );
      expect(updatedState).toEqual(initialDocState);
    });

    it('should update state for markDocAsUpToDateSuccess', () => {
      const updatedState = docFeature.reducer(
        stateAfterMarkDocAsUpToDate,
        DocActions.markDocAsUpToDateSuccess,
      );
      expect(updatedState).toEqual(initialDocState);
    });

    it('should update state for deleteDocSuccess', () => {
      const updatedState = docFeature.reducer(
        stateAfterDeleteDoc,
        DocActions.deleteDocSuccess,
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
