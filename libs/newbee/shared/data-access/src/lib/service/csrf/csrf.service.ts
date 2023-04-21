import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BaseCsrfTokenDto,
  csrfUrl,
  csrfVersion,
} from '@newbee/shared/data-access';
import { Observable } from 'rxjs';

/**
 * The service tied to the API's CSRF endpoints.
 * Specifically handles getting a CSRF token for CSRF prevention.
 */
@Injectable({ providedIn: 'root' })
export class CsrfService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Sends a GET request to make the backend generate a CSRF token.
   * @returns An observable of the CSRF token DTO.
   */
  createToken(): Observable<BaseCsrfTokenDto> {
    return this.http.get<BaseCsrfTokenDto>(`/api/v${csrfVersion}/${csrfUrl}`);
  }
}
