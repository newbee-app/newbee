import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BaseQueryDto,
  BaseQueryResultDto,
  BaseSuggestDto,
  BaseSuggestResultDto,
  organizationUrl,
  searchUrl,
  searchVersion,
  suggestUrl,
} from '@newbee/shared/data-access';
import { Observable } from 'rxjs';

/**
 * The service tied to the API's search endpoints.
 * Handles search and suggest.
 */
@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(private readonly http: HttpClient) {}

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
      `/api/v${searchVersion}/${organizationUrl}/${orgSlug}/${searchUrl}`,
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
      `/api/v${searchVersion}/${organizationUrl}/${orgSlug}/${suggestUrl}`,
      query
    );
  }
}
