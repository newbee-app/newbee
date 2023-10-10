import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseCreateQnaDto, apiVersion } from '@newbee/shared/data-access';
import { Keyword, Qna } from '@newbee/shared/util';
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
}
