import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  authenticatorVersion,
  BaseRegistrationResponseDto,
  UrlEndpoint,
} from '@newbee/shared/data-access';
import { Authenticator } from '@newbee/shared/util';
import { startRegistration } from '@simplewebauthn/browser';
import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types';
import { from, Observable, switchMap } from 'rxjs';

/**
 * The service tied to the API's authenticator endpoints.
 * Specifically handles registering new authenticators for already logged in users.
 */
@Injectable({ providedIn: 'root' })
export class AuthenticatorService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Sends a GET request to get all of the authenticators of the logged in user.
   * @returns An observable containing all of the logged in user's authenticators.
   */
  getAuthenticators(): Observable<Authenticator[]> {
    return this.http.get<Authenticator[]>(
      `/${UrlEndpoint.Api}/v${authenticatorVersion}/${UrlEndpoint.Authenticator}`
    );
  }

  /**
   * Sends a POST request to make the backend generate public key creation options.
   * @returns An observable of the backend's public key creation options.
   */
  createOptions(): Observable<PublicKeyCredentialCreationOptionsJSON> {
    return this.http.post<PublicKeyCredentialCreationOptionsJSON>(
      `/${UrlEndpoint.Api}/v${authenticatorVersion}/${UrlEndpoint.Authenticator}/${UrlEndpoint.Options}`,
      {}
    );
  }

  /**
   * Sends a POST request to save the new authenticator.
   *
   * @param options The public key creation options generated by the backend.
   * @returns An observable of the newly created authenticator.
   */
  create(
    options: PublicKeyCredentialCreationOptionsJSON
  ): Observable<Authenticator> {
    return from(startRegistration(options)).pipe(
      switchMap((response) => {
        const registrationResponseDto: BaseRegistrationResponseDto = {
          response,
        };
        return this.http.post<Authenticator>(
          `/${UrlEndpoint.Api}/v${authenticatorVersion}/${UrlEndpoint.Authenticator}`,
          registrationResponseDto
        );
      })
    );
  }
}
