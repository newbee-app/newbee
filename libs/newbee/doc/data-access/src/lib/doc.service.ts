import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiVersion } from '@newbee/shared/data-access';
import {
  BaseCreateDocDto,
  BaseDocAndMemberDto,
  BaseUpdateDocDto,
  Doc,
  DocQueryResult,
  Keyword,
  OffsetAndLimit,
  PaginatedResults,
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
   * Sends a request to the API to get all of the docs in the given organization in a paginated format.
   *
   * @param orgSlug The org to look in.
   * @param offsetAndLimit The offset and limit for the request.
   *
   * @returns An observable containing the paginated docs.
   */
  getAll(
    orgSlug: string,
    offsetAndLimit: OffsetAndLimit,
  ): Observable<PaginatedResults<DocQueryResult>> {
    const params = new HttpParams({ fromObject: { ...offsetAndLimit } });
    return this.http.get<PaginatedResults<DocQueryResult>>(
      DocService.baseApiUrl(orgSlug),
      { params },
    );
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

  /**
   * Sends a request to the API to edit a doc.
   *
   * @param docSlug The slug of the doc to edit.
   * @param orgSlug The org to look in.
   * @param updateDocDto The new details for the doc.
   *
   * @returns An observable containing the updated doc.
   */
  edit(
    docSlug: string,
    orgSlug: string,
    updateDocDto: BaseUpdateDocDto,
  ): Observable<BaseDocAndMemberDto> {
    return this.http.patch<BaseDocAndMemberDto>(
      `${DocService.baseApiUrl(orgSlug)}/${docSlug}`,
      updateDocDto,
    );
  }

  /**
   * Sends a request to the API to delete a doc.
   *
   * @param docSlug The slug of the doc to delete.
   * @param orgSlug The org to look in.
   *
   * @returns A null observable.
   */
  delete(docSlug: string, orgSlug: string): Observable<null> {
    return this.http.delete<null>(
      `${DocService.baseApiUrl(orgSlug)}/${docSlug}`,
    );
  }
}
