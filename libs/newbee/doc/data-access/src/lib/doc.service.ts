import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiVersion } from '@newbee/shared/data-access';
import { BaseCreateDocDto, Doc, Keyword } from '@newbee/shared/util';
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
}
