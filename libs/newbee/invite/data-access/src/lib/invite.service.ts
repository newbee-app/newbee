import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiVersion } from '@newbee/shared/data-access';
import { BaseTokenDto, Keyword, OrgMemberNoUser } from '@newbee/shared/util';
import { Observable } from 'rxjs';

/**
 * The service tied tot he API's invite endpoints.
 */
@Injectable()
export class InviteService {
  /**
   * Get the base API URL for dealing with org member invites.
   */
  static baseApiUrl = `/${Keyword.Api}/v${apiVersion['org-member-invite']}/${Keyword.Invite}`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Send a request to the API to accept an org invite.
   *
   * @param tokenDto The invite token.
   *
   * @returns A null observable.
   */
  acceptInvite(tokenDto: BaseTokenDto): Observable<OrgMemberNoUser> {
    return this.http.post<OrgMemberNoUser>(
      `${InviteService.baseApiUrl}/${Keyword.Accept}`,
      tokenDto,
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
      `${InviteService.baseApiUrl}/${Keyword.Decline}`,
      tokenDto,
    );
  }
}
