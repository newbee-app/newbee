import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  apiVersion,
  BaseQueryDto,
  BaseQueryResultDto,
  BaseSuggestDto,
  BaseSuggestResultDto,
} from '@newbee/shared/data-access';
import { Keyword } from '@newbee/shared/util';
import { Observable } from 'rxjs';

/**
 * The service tied to the API's search endpoints.
 * Handles search and suggest.
 */
@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(private readonly http: HttpClient) {}

  /**
   * The base API URL for dealing with search.
   *
   * @param orgSlug The slug of the org to search in.
   *
   * @returns The base API URL for dealing with search.
   */
  static baseApiUrl(orgSlug: string): string {
    return `/${Keyword.Api}/v${apiVersion.search}/${Keyword.Organization}/${orgSlug}/${Keyword.Search}`;
  }

  /**
   * Sends a search request with the given query to the given organization.
   *
   * @param query The search query.
   * @param orgSlug The organization to serach in.
   *
   * @returns An observable containing the results of the search.
   */
  search(query: BaseQueryDto, orgSlug: string): Observable<BaseQueryResultDto> {
    return this.http.post<BaseQueryResultDto>(
      SearchService.baseApiUrl(orgSlug),
      query
    );
  }

  /**
   * Sends a suggest request with the given query to the given organization.
   *
   * @param query The suggest query.
   * @param orgSlug The organization to search in.
   *
   * @returns An observable containing the search suggestions.
   */
  suggest(
    query: BaseSuggestDto,
    orgSlug: string
  ): Observable<BaseSuggestResultDto> {
    return this.http.post<BaseSuggestResultDto>(
      `${SearchService.baseApiUrl(orgSlug)}/${Keyword.Suggest}`,
      query
    );
  }
}
