import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BaseUpdateUserDto,
  UrlEndpoint,
  userVersion,
} from '@newbee/shared/data-access';
import type { User } from '@newbee/shared/util';
import { Observable } from 'rxjs';

/**
 * The service tied to the API's user-related endpoints.
 * Handles updating and deleting users.
 */
@Injectable()
export class UserService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Send a request to the API to edit an existing user with the given information.
   *
   * @param updateUserDto The DTO containing the necessary information to edit an existing user.
   *
   * @returns An observable containing information about the edited user.
   */
  edit(updateUserDto: BaseUpdateUserDto): Observable<User> {
    return this.http.patch<User>(
      `/${UrlEndpoint.Api}/v${userVersion}/${UrlEndpoint.User}`,
      updateUserDto
    );
  }

  /**
   * Sends a request to the API to delete the current user.
   */
  delete(): Observable<null> {
    return this.http.delete<null>(
      `/${UrlEndpoint.Api}/v${userVersion}/${UrlEndpoint.User}`
    );
  }
}
