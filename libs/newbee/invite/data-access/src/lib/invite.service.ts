import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BaseTokenDto,
  orgMemberInviteVersion,
  UrlEndpoint,
} from '@newbee/shared/data-access';
import { Observable } from 'rxjs';

/**
 * The service tied tot he API's invite endpoints.
 */
@Injectable()
export class InviteService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Send a request to the API to accept an org invite.
   *
   * @param tokenDto The invite token.
   *
   * @returns A null observable.
   */
  acceptInvite(tokenDto: BaseTokenDto): Observable<null> {
    return this.http.post<null>(
      `/${UrlEndpoint.Api}/v${orgMemberInviteVersion}/${UrlEndpoint.Invite}/${UrlEndpoint.Accept}`,
      tokenDto
    );
  }

  /**
   * Send a request to the API to decline an org invite.
   *
   * @param tokenDto The invite token.
   *
   * @returns A null observable.
   */
  declineInvite(tokenDto: BaseTokenDto): Observable<null> {
    return this.http.post<null>(
      `/${UrlEndpoint.Api}/v${orgMemberInviteVersion}/${UrlEndpoint.Invite}/${UrlEndpoint.Decline}`,
      tokenDto
    );
  }
}
