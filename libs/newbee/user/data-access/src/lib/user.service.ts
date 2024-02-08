import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiVersion } from '@newbee/shared/data-access';
import { Keyword, TokenDto, UpdateUserDto, User } from '@newbee/shared/util';
import { Observable } from 'rxjs';

/**
 * The service tied to the API's user-related endpoints.
 * Handles updating and deleting users.
 */
@Injectable()
export class UserService {
  /**
   * The base API URL for dealing with the logged-in user.
   */
  static baseApiUrl = `/${Keyword.Api}/v${apiVersion.user}/${Keyword.User}`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Send a request to the API to edit an existing user with the given information.
   *
   * @param updateUserDto The DTO containing the necessary information to edit an existing user.
   *
   * @returns An observable containing information about the edited user.
   */
  edit(updateUserDto: UpdateUserDto): Observable<User> {
    return this.http.patch<User>(UserService.baseApiUrl, updateUserDto);
  }

  /**
   * Sends a request to the API to delete the current user.
   *
   * @returns A null observable.
   */
  delete(): Observable<null> {
    return this.http.delete<null>(UserService.baseApiUrl);
  }

  /**
   * Send a request to the API to verify a user's email based on a token.
   *
   * @param token The token of the user email to verify.
   *
   * @returns An observable containing the email verified user.
   */
  verifyEmail(token: string): Observable<User> {
    const tokenDto = new TokenDto(token);
    return this.http.post<User>(
      `${UserService.baseApiUrl}/${Keyword.Verify}`,
      tokenDto,
    );
  }

  /**
   * Send a request to the API to send a verification email for the logged-in user.
   *
   * @returns A null observable.
   */
  sendVerificationEmail(): Observable<null> {
    return this.http.post<null>(UserService.baseApiUrl, {});
  }
}
