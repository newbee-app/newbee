import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  apiVersion,
  BaseCreateUserDto,
  BaseEmailDto,
  BaseMagicLinkLoginDto,
  BaseUserRelationAndOptionsDto,
  BaseWebAuthnLoginDto,
} from '@newbee/shared/data-access';
import { Keyword, UserRelation } from '@newbee/shared/util';
import { startAuthentication } from '@simplewebauthn/browser';
import type { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/typescript-types';
import { from, Observable, switchMap } from 'rxjs';

/**
 * The service tied to the API's auth endpoints.
 * Handles logging in and registering users.
 */
@Injectable()
export class AuthService {
  /**
   * The base API URL for dealing with authentication.
   */
  static baseApiUrl = `/${Keyword.Api}/v${apiVersion.auth}/${Keyword.Auth}`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Send a POST request to send a magic link for login.
   *
   * @param emailDto The DTO containing the necessary email.
   *
   * @returns An observable containing the magic link's JWT ID and the email the magic link was sent to.
   */
  magicLinkLoginLogin(
    emailDto: BaseEmailDto
  ): Observable<BaseMagicLinkLoginDto> {
    return this.http.post<BaseMagicLinkLoginDto>(
      `${AuthService.baseApiUrl}/${Keyword.MagicLinkLogin}/${Keyword.Login}`,
      emailDto
    );
  }

  /**
   * Sends a POST request to verify the magic link token.
   *
   * @param token The token associated with the magic link.
   * @returns An observable containing information about the logged in user.
   */
  magicLinkLogin(token: string): Observable<UserRelation> {
    return this.http.post<UserRelation>(
      `${AuthService.baseApiUrl}/${Keyword.MagicLinkLogin}`,
      { token }
    );
  }

  /**
   * Sends a POST request to make the backend create a new user, access token, and generate the options needed to register an authenticator.
   *
   * @param createUserDto The DTO containing the necessary information for creating a new user.
   *
   * @returns An observable containing the newly created user, their access token, and the options needed to register an authenticator.
   */
  webAuthnRegister(
    createUserDto: BaseCreateUserDto
  ): Observable<BaseUserRelationAndOptionsDto> {
    return this.http.post<BaseUserRelationAndOptionsDto>(
      `${AuthService.baseApiUrl}/${Keyword.Webauthn}/${Keyword.Register}`,
      createUserDto
    );
  }

  /**
   * Sends a POST request to create login authenticator options.
   *
   * @param emailDto The DTO containing the necessary email.
   *
   * @returns An observable of the options needed to log in with a registered authenticator.
   */
  webAuthnLoginOptions(
    emailDto: BaseEmailDto
  ): Observable<PublicKeyCredentialRequestOptionsJSON> {
    return this.http.post<PublicKeyCredentialRequestOptionsJSON>(
      `${AuthService.baseApiUrl}/${Keyword.Webauthn}/${Keyword.Login}/${Keyword.Options}`,
      emailDto
    );
  }

  /**
   * Combines the email DTO with the given options to create a `BaseWebAuthnLoginDto`, which it uses to send a POST request to verify the authenticator's response and log the user in.
   *
   * @param emailDto The DTO containing the necessary email.
   * @param options The options to feed into the authenticator.
   *
   * @returns An observable containing information about the logged in user.
   */
  webAuthnLogin(
    emailDto: BaseEmailDto,
    options: PublicKeyCredentialRequestOptionsJSON
  ): Observable<UserRelation> {
    return from(startAuthentication(options)).pipe(
      switchMap((response) => {
        const webAuthnLoginDto: BaseWebAuthnLoginDto = {
          ...emailDto,
          response,
        };
        return this.http.post<UserRelation>(
          `${AuthService.baseApiUrl}/${Keyword.Webauthn}/${Keyword.Login}`,
          webAuthnLoginDto
        );
      })
    );
  }

  /**
   * Logs the user out of the application by sending a request to the backend to invalidate the user's auth token.
   */
  logout(): Observable<void> {
    return this.http.post<void>(
      `${AuthService.baseApiUrl}/${Keyword.Logout}`,
      {}
    );
  }
}
