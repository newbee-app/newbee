import {
  testBaseQnaAndMemberDto1,
  testQnaRelation1,
  testTeamMember1,
} from '@newbee/shared/util';
import { QnaActions } from './qna.actions';
import { QnaState, initialQnaState, qnaFeature } from './qna.reducer';

describe('QnaReducer', () => {
  const stateAfterGetQnaSuccess: QnaState = {
    selectedQna: testQnaRelation1,
    teamMember: testTeamMember1,
  };

  describe('from initial state', () => {
    it('should update state for getQnaSuccess', () => {
      const updatedState = qnaFeature.reducer(
        initialQnaState,
        QnaActions.getQnaSuccess({ qnaAndMemberDto: testBaseQnaAndMemberDto1 }),
      );
      expect(updatedState).toEqual(stateAfterGetQnaSuccess);
    });
  });

  describe('from altered state', () => {
    it('should update state for resetSelectedQna', () => {
      const updatedState = qnaFeature.reducer(
        stateAfterGetQnaSuccess,
        QnaActions.resetSelectedQna,
      );
      expect(updatedState).toEqual(initialQnaState);
    });
  });
});
