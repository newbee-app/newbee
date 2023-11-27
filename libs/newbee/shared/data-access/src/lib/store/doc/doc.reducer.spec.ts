import {
  Doc,
  testBaseDocAndMemberDto1,
  testDoc1,
  testDocRelation1,
  testTeamMember1,
} from '@newbee/shared/util';
import { DocActions } from './doc.actions';
import { DocState, docFeature, initialDocstate } from './doc.reducer';

describe('DocReducer', () => {
  const stateAfterGetDocSuccess: DocState = {
    selectedDoc: testDocRelation1,
    teamMember: testTeamMember1,
  };

  describe('from initial state', () => {
    it('should update state for getDocSuccess', () => {
      const updatedState = docFeature.reducer(
        initialDocstate,
        DocActions.getDocSuccess({ docAndMemberDto: testBaseDocAndMemberDto1 }),
      );
      expect(updatedState).toEqual(stateAfterGetDocSuccess);
    });

    it('should do nothing for editDocSuccess', () => {
      const updatedState = docFeature.reducer(
        initialDocstate,
        DocActions.editDocSuccess({ doc: testDoc1 }),
      );
      expect(updatedState).toEqual(initialDocstate);
    });
  });

  describe('from altered state', () => {
    it('should reset state for certain actions', () => {
      const updatedState = docFeature.reducer(
        stateAfterGetDocSuccess,
        DocActions.resetSelectedDoc,
      );
      expect(updatedState).toEqual(initialDocstate);
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
