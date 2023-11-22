import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiVersion } from '@newbee/shared/data-access';
import {
  BaseCreateQnaDto,
  BaseQnaAndMemberDto,
  BaseUpdateAnswerDto,
  BaseUpdateQuestionDto,
  Keyword,
  Qna,
} from '@newbee/shared/util';
import { Observable } from 'rxjs';

@Injectable()
export class QnaService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get the base API URL for dealing with QnAs.
   *
   * @param orgSlug The slug of the org to look in.
   *
   * @returns The base API URL for dealing with a QnA.
   */
  static baseApiUrl(orgSlug: string): string {
    return `/${Keyword.Api}/v${apiVersion.qna}/${Keyword.Organization}/${orgSlug}/${Keyword.Qna}`;
  }

  /**
   * Sends a request to the API to create a QnA in the given organization with the given information.
   *
   * @param createQnaDto The information to use to create a new QnA.
   * @param orgSlug The org to create the QnA in.
   * @param teamSlug The team to create the QnA in, if applicable.
   *
   * @returns An observable containing the created QnA.
   */
  create(createQnaDto: BaseCreateQnaDto, orgSlug: string): Observable<Qna> {
    return this.http.post<Qna>(QnaService.baseApiUrl(orgSlug), createQnaDto);
  }

  /**
   * Sends a request to the API to get a qna in the given organization with the given slug.
   *
   * @param qnaSlug The slug of the qna to get.
   * @param orgSlug The org to look in.
   *
   * @returns An observable containing the requested qna.
   */
  get(qnaSlug: string, orgSlug: string): Observable<BaseQnaAndMemberDto> {
    return this.http.get<BaseQnaAndMemberDto>(
      `${QnaService.baseApiUrl(orgSlug)}/${qnaSlug}`,
    );
  }

  /**
   * Sends a request to the API to mark a qna as up-to-date.
   *
   * @param qnaSlug The slug of the qna to update.
   * @param orgSlug The org to look in.
   *
   * @returns An observable containing the updated qna.
   */
  markUpToDate(qnaSlug: string, orgSlug: string): Observable<Qna> {
    return this.http.post<Qna>(
      `${QnaService.baseApiUrl(orgSlug)}/${qnaSlug}`,
      {},
    );
  }

  /**
   * Sends a request to the API to edit the question portion of a qna.
   *
   * @param qnaSlug The slug of the qna to update.
   * @param orgSlug The org to look in.
   * @param updateQuestionDto The new details for the question.
   *
   * @returns An observable containing the updated qna.
   */
  editQuestion(
    qnaSlug: string,
    orgSlug: string,
    updateQuestionDto: BaseUpdateQuestionDto,
  ): Observable<Qna> {
    return this.http.patch<Qna>(
      `${QnaService.baseApiUrl(orgSlug)}/${qnaSlug}/${Keyword.Question}`,
      updateQuestionDto,
    );
  }

  /**
   * Sends a request to the API to edit the answer portion of a qna.
   *
   * @param qnaSlug The slug of the qna to update.
   * @param orgSlug The org to look in.
   * @param updateAnswerDto The new details for the answer.
   *
   * @returns An observable containing the udpated qna.
   */
  editAnswer(
    qnaSlug: string,
    orgSlug: string,
    updateAnswerDto: BaseUpdateAnswerDto,
  ): Observable<Qna> {
    return this.http.patch<Qna>(
      `${QnaService.baseApiUrl(orgSlug)}/${qnaSlug}/${Keyword.Answer}`,
      updateAnswerDto,
    );
  }

  /**
   * Sends a request to the API to delete a qna.
   *
   * @param qnaSlug The slug of the qna to delete.
   * @param orgSlug The org to look in.
   *
   * @returns A null observable.
   */
  delete(qnaSlug: string, orgSlug: string): Observable<null> {
    return this.http.delete<null>(
      `${QnaService.baseApiUrl(orgSlug)}/${qnaSlug}`,
    );
  }
}
