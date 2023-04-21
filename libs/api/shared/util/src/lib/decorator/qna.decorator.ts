import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { qnaKey } from '../constant';

/**
 * The decorator used to extract the `QnaEntity` appended to the request by the `RoleGuard`.
 * Used in the parameter of a controller function.
 */
export const Qna = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const qna = request[qnaKey];
    return data ? qna?.[data] : qna;
  }
);
