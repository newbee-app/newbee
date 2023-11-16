import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiVersion } from '@newbee/shared/data-access';
import {
  BaseCreateQnaDto,
  BaseQnaAndMemberDto,
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
  create(
    createQnaDto: BaseCreateQnaDto,
    orgSlug: string,
    teamSlug: string | null,
  ): Observable<Qna> {
    const params = teamSlug
      ? new HttpParams({ fromObject: { [Keyword.Team]: teamSlug } })
      : null;
    return this.http.post<Qna>(QnaService.baseApiUrl(orgSlug), createQnaDto, {
      ...(params && { params }),
    });
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
}
