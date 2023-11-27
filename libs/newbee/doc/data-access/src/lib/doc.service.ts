import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiVersion } from '@newbee/shared/data-access';
import {
  BaseCreateDocDto,
  BaseDocAndMemberDto,
  Doc,
  Keyword,
} from '@newbee/shared/util';
import { Observable } from 'rxjs';

/**
 * Service for interacting with the doc portion of the API.
 */
@Injectable()
export class DocService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get the base API URL for dealing with docs.
   *
   * @param orgSlug The slug of the org to look in.
   *
   * @returns The base API URL for dealing with a doc.
   */
  static baseApiUrl(orgSlug: string): string {
    return `/${Keyword.Api}/v${apiVersion.doc}/${Keyword.Organization}/${orgSlug}/${Keyword.Doc}`;
  }

  /**
   * Sends a request to the API to create a doc in the given organization with the given information.
   *
   * @param orgSlug The org to create the doc in.
   * @param createDocDto The information to use to create a new doc.
   *
   * @returns An observable containing the created doc.
   */
  create(orgSlug: string, createDocDto: BaseCreateDocDto): Observable<Doc> {
    return this.http.post<Doc>(DocService.baseApiUrl(orgSlug), createDocDto);
  }

  /**
   * Sends a request to the API to get a doc in the given organization with the given slug.
   *
   * @param docSlug The slug of the doc to get.
   * @param orgSlug The org to look in.
   *
   * @returns An observable containing the requested doc.
   */
  get(docSlug: string, orgSlug: string): Observable<BaseDocAndMemberDto> {
    return this.http.get<BaseDocAndMemberDto>(
      `${DocService.baseApiUrl(orgSlug)}/${docSlug}`,
    );
  }

  /**
   * Sends a request to the API to mark a doc as up-to-date.
   *
   * @param docSlug The slug of the doc to update.
   * @param orgSlug The org to look in.
   *
   * @returns An observable containing the udpated doc.
   */
  markUpToDate(docSlug: string, orgSlug: string): Observable<Doc> {
    return this.http.post<Doc>(
      `${DocService.baseApiUrl(orgSlug)}/${docSlug}`,
      {},
    );
  }
}
