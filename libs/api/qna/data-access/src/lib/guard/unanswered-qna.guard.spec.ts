import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { testQnaEntity1 } from '@newbee/api/shared/data-access';
import { QnaService } from '../qna.service';
import { UnansweredQnaGuard } from './unanswered-qna.guard';

describe('UnansweredQnaGuard', () => {
  let guard: UnansweredQnaGuard;
  let qnaService: QnaService;
  let context: ExecutionContext;

  beforeEach(() => {
    qnaService = createMock<QnaService>({
      findOneBySlug: jest.fn().mockResolvedValue(testQnaEntity1),
    });
    guard = new UnansweredQnaGuard(qnaService);
    context = createMock<ExecutionContext>({
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          params: {
            qna: testQnaEntity1.slug,
          },
        }),
      }),
    });
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
    expect(qnaService).toBeDefined();
    expect(context).toBeDefined();
  });

  describe('preliminary checks', () => {
    it('should return true if qna was never specified', async () => {
      jest
        .spyOn(context.switchToHttp(), 'getRequest')
        .mockReturnValue({ params: {} });
      await expect(guard.canActivate(context)).resolves.toBeTruthy();
    });
  });

  describe('qna check', () => {
    it('should return false if qna is answered', async () => {
      await expect(guard.canActivate(context)).resolves.toBeFalsy();
    });

    it('should return true if qna is unanswered', async () => {
      jest
        .spyOn(qnaService, 'findOneBySlug')
        .mockResolvedValue({ ...testQnaEntity1, answerMarkdown: null });
      await expect(guard.canActivate(context)).resolves.toBeTruthy();
    });

    it('should return false if qna service throws an error', async () => {
      jest
        .spyOn(qnaService, 'findOneBySlug')
        .mockRejectedValue(new Error('findOneBySlug'));
      await expect(guard.canActivate(context)).resolves.toBeFalsy();
    });
  });
});
