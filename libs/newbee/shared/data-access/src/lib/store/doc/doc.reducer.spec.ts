import {
  Doc,
  testBaseDocAndMemberDto1,
  testDoc1,
  testDocRelation1,
  testTeamMember1,
} from '@newbee/shared/util';
import { DocActions } from './doc.actions';
import { DocState, docFeature, initialDocState } from './doc.reducer';

describe('DocReducer', () => {
  const stateAfterGetDocSuccess: DocState = {
    selectedDoc: testDocRelation1,
    teamMember: testTeamMember1,
  };

  describe('from initial state', () => {
    it('should update state for getDocSuccess', () => {
      const updatedState = docFeature.reducer(
        initialDocState,
        DocActions.getDocSuccess({ docAndMemberDto: testBaseDocAndMemberDto1 }),
      );
      expect(updatedState).toEqual(stateAfterGetDocSuccess);
    });

    it('should do nothing for editDocSuccess', () => {
      const updatedState = docFeature.reducer(
        initialDocState,
        DocActions.editDocSuccess({ doc: testDoc1 }),
      );
      expect(updatedState).toEqual(initialDocState);
    });
  });

  describe('from altered state', () => {
    it('should reset state for certain actions', () => {
      let updatedState = docFeature.reducer(
        stateAfterGetDocSuccess,
        DocActions.resetSelectedDoc,
      );
      expect(updatedState).toEqual(initialDocState);

      updatedState = docFeature.reducer(
        stateAfterGetDocSuccess,
        DocActions.deleteDocSuccess,
      );
      expect(updatedState).toEqual(initialDocState);
    });

    it('should update state for editDocSuccess', () => {
      const newDoc: Doc = { ...testDoc1, title: 'New title' };
      const updatedState = docFeature.reducer(
        stateAfterGetDocSuccess,
        DocActions.editDocSuccess({ doc: newDoc }),
      );
      expect(updatedState).toEqual({
        ...stateAfterGetDocSuccess,
        selectedDoc: { ...testDocRelation1, doc: newDoc },
      });
    });
  });
});
