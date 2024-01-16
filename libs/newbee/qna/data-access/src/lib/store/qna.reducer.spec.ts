import {
  HttpActions,
  QnaActions,
  RouterActions,
} from '@newbee/newbee/shared/data-access';
import { testPaginatedResultsQnaQueryResult1 } from '@newbee/shared/util';
import { QnaState, initialQnaState, qnaFeature } from './qna.reducer';

describe('QnaReducer', () => {
  const stateAfterGetQnas: QnaState = {
    ...initialQnaState,
    pendingGetQnas: true,
  };
  const stateAfterCreateQna: QnaState = {
    ...initialQnaState,
    pendingCreate: true,
  };
  const stateAfterMarkQnaAsUpToDate: QnaState = {
    ...initialQnaState,
    pendingUpToDate: true,
  };
  const stateAfterEditQuestion: QnaState = {
    ...initialQnaState,
    pendingEditQuestion: true,
  };
  const stateAfterEditAnswer: QnaState = {
    ...initialQnaState,
    pendingEditAnswer: true,
  };
  const stateAfterDeleteQna: QnaState = {
    ...initialQnaState,
    pendingDelete: true,
  };

  describe('from initial state', () => {
    it('should update state for getQnas', () => {
      const updatedState = qnaFeature.reducer(
        initialQnaState,
        QnaActions.getQnas,
      );
      expect(updatedState).toEqual(stateAfterGetQnas);
    });

    it('should update state for createQna', () => {
      const updatedState = qnaFeature.reducer(
        initialQnaState,
        QnaActions.createQna,
      );
      expect(updatedState).toEqual(stateAfterCreateQna);
    });

    it('should update state for markQnaAsUpToDate', () => {
      const updatedState = qnaFeature.reducer(
        initialQnaState,
        QnaActions.markQnaAsUpToDate,
      );
      expect(updatedState).toEqual(stateAfterMarkQnaAsUpToDate);
    });

    it('should update state for editQuestion', () => {
      const updatedState = qnaFeature.reducer(
        initialQnaState,
        QnaActions.editQuestion,
      );
      expect(updatedState).toEqual(stateAfterEditQuestion);
    });

    it('should update state for editAnswer', () => {
      const updatedState = qnaFeature.reducer(
        initialQnaState,
        QnaActions.editAnswer,
      );
      expect(updatedState).toEqual(stateAfterEditAnswer);
    });

    it('should update state for deleteQna', () => {
      const updatedState = qnaFeature.reducer(
        initialQnaState,
        QnaActions.deleteQna,
      );
      expect(updatedState).toEqual(stateAfterDeleteQna);
    });
  });

  describe('from altered state', () => {
    it('should update state for getQnasSuccess', () => {
      const updatedState = qnaFeature.reducer(
        stateAfterGetQnas,
        QnaActions.getQnasSuccess({
          qnas: testPaginatedResultsQnaQueryResult1,
        }),
      );
      expect(updatedState).toEqual({
        ...initialQnaState,
        qnas: testPaginatedResultsQnaQueryResult1,
      });
    });

    it('should update state for createQnaSuccess', () => {
      const updatedState = qnaFeature.reducer(
        stateAfterCreateQna,
        QnaActions.createQnaSuccess,
      );
      expect(updatedState).toEqual(initialQnaState);
    });

    it('should update state for getQnaSuccess', () => {
      const updatedState = qnaFeature.reducer(
        stateAfterEditQuestion,
        QnaActions.getQnaSuccess,
      );
      expect(updatedState).toEqual(initialQnaState);
    });

    it('should update state for editQnaSuccess', () => {
      let updatedState = qnaFeature.reducer(
        stateAfterMarkQnaAsUpToDate,
        QnaActions.editQnaSuccess,
      );
      expect(updatedState).toEqual(initialQnaState);

      updatedState = qnaFeature.reducer(
        stateAfterEditAnswer,
        QnaActions.editQnaSuccess,
      );
      expect(updatedState).toEqual(initialQnaState);
    });

    it('should update state for deleteQnaSuccess', () => {
      const updatedState = qnaFeature.reducer(
        stateAfterDeleteQna,
        QnaActions.deleteQnaSuccess,
      );
      expect(updatedState).toEqual(initialQnaState);
    });

    it('should update state for clientError', () => {
      const updatedState = qnaFeature.reducer(
        stateAfterCreateQna,
        HttpActions.clientError,
      );
      expect(updatedState).toEqual(initialQnaState);
    });

    it('should update state for routerRequest', () => {
      const updatedState = qnaFeature.reducer(
        stateAfterCreateQna,
        RouterActions.routerRequest,
      );
      expect(updatedState).toEqual(initialQnaState);
    });
  });
});
