import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { qna } from '@newbee/shared/data-access';
import { QnaService } from '../qna.service';

/**
 * A guard that prevents users from accessing endpoints that involve QnAs unless that QnA is unanswered.
 */
@Injectable()
export class UnansweredQnaGuard implements CanActivate {
  constructor(private readonly qnaService: QnaService) {}

  /**
   * Allows users to access a given route if:
   *
   * - It doesn't specify a qna in its route params.
   * - The qna its route param specifies is unanswered.
   *
   * @param context The context of the request.
   * @returns `true` if qna wasn't specified or if the specified qna is unanswered, `false` otherwise.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;
    const qnaSlug: string | undefined = params[qna];

    if (!qnaSlug) {
      return true;
    }

    try {
      const qna = await this.qnaService.findOneBySlug(qnaSlug);
      return !qna.answerMarkdown;
    } catch (err) {
      return false;
    }
  }
}
