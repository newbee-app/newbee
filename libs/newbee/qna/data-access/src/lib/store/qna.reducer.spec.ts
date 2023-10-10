import {
  HttpActions,
  QnaActions,
  RouterActions,
} from '@newbee/newbee/shared/data-access';
import { QnaState, initialQnaState, qnaFeature } from './qna.reducer';

describe('QnaReducer', () => {
  const stateAfterCreateQna: QnaState = {
    ...initialQnaState,
    pendingCreate: true,
  };

  describe('from initial state', () => {
    it('should update state for createQna', () => {
      const updatedState = qnaFeature.reducer(
        initialQnaState,
        QnaActions.createQna,
      );
      expect(updatedState).toEqual(stateAfterCreateQna);
    });
  });

  describe('from altered state', () => {
    it('should update state for createQnaSuccess', () => {
      const updatedState = qnaFeature.reducer(
        stateAfterCreateQna,
        QnaActions.createQnaSuccess,
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
