import {
  Qna,
  testQna1,
  testQnaAndMemberDto1,
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
        QnaActions.getQnaSuccess({ qnaAndMemberDto: testQnaAndMemberDto1 }),
      );
      expect(updatedState).toEqual(stateAfterGetQnaSuccess);
    });

    it('should do nothing for editQnaSuccess', () => {
      const updatedState = qnaFeature.reducer(
        initialQnaState,
        QnaActions.editQnaSuccess({ qna: testQna1 }),
      );
      expect(updatedState).toEqual(initialQnaState);
    });
  });

  describe('from altered state', () => {
    it('should reset state for certain actions', () => {
      let updatedState = qnaFeature.reducer(
        stateAfterGetQnaSuccess,
        QnaActions.resetSelectedQna,
      );
      expect(updatedState).toEqual(initialQnaState);

      updatedState = qnaFeature.reducer(
        stateAfterGetQnaSuccess,
        QnaActions.deleteQnaSuccess,
      );
      expect(updatedState).toEqual(initialQnaState);
    });

    it('should update state for editQnaSuccess', () => {
      const newQna: Qna = { ...testQna1, title: 'New title' };
      const updatedState = qnaFeature.reducer(
        stateAfterGetQnaSuccess,
        QnaActions.editQnaSuccess({ qna: newQna }),
      );
      expect(updatedState).toEqual({
        ...stateAfterGetQnaSuccess,
        selectedQna: { ...testQnaRelation1, qna: newQna },
      });
    });
  });
});
