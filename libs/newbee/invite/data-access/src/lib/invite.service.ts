import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiVersion, BaseTokenDto } from '@newbee/shared/data-access';
import { Keyword, OrgMemberNoUser } from '@newbee/shared/util';
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
  acceptInvite(tokenDto: BaseTokenDto): Observable<OrgMemberNoUser> {
    return this.http.post<OrgMemberNoUser>(
      `/${Keyword.Api}/v${apiVersion.orgMemberInvite}/${Keyword.Invite}/${Keyword.Accept}`,
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
      `/${Keyword.Api}/v${apiVersion.orgMemberInvite}/${Keyword.Invite}/${Keyword.Decline}`,
      tokenDto
    );
  }
}
