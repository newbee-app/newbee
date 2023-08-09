import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiVersion, BaseUpdateOrgMemberDto } from '@newbee/shared/data-access';
import { Keyword, OrgMember, OrgMemberNoOrg } from '@newbee/shared/util';
import { Observable } from 'rxjs';

/**
 * The service tied to the API's org member-related endpoints.
 * Handles CRUD for org members.
 */
@Injectable()
export class OrgMemberService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get the base API URL for dealing with org members.
   *
   * @param orgSlug The slug of the org to look in.
   * @param memberSlug The slug of the member to look for.
   *
   * @returns The base API URL for dealing with org members.
   */
  static baseApiUrl(orgSlug: string, memberSlug: string): string {
    return `/${Keyword.Api}/v${apiVersion.orgMember}/${Keyword.Organization}/${orgSlug}/${Keyword.Member}/${memberSlug}`;
  }

  /**
   * Send a request to the API to get the org member associated with the given slug.
   *
   * @param orgSlug The slug of the org to look in.
   * @param memberSlug The slug of the member to look for.
   *
   * @returns An observable containing information about the org member.
   */
  get(orgSlug: string, memberSlug: string): Observable<OrgMemberNoOrg> {
    return this.http.get<OrgMemberNoOrg>(
      OrgMemberService.baseApiUrl(orgSlug, memberSlug)
    );
  }

  /**
   * Send a request to the API to edit an existing org member with the given information.
   *
   * @param orgSlug The slug of the org to look in.
   * @param memberSlug The slug of the member to look for.
   * @param updateOrgMemberDto The new details for the org member.
   *
   * @returns An observable containing the new org member.
   */
  edit(
    orgSlug: string,
    memberSlug: string,
    updateOrgMemberDto: BaseUpdateOrgMemberDto
  ): Observable<OrgMember> {
    return this.http.patch<OrgMember>(
      OrgMemberService.baseApiUrl(orgSlug, memberSlug),
      updateOrgMemberDto
    );
  }

  /**
   * Send a request to the API to delete an existing org member.
   *
   * @param orgSlug The slug of the org to look in.
   * @param memberSlug The slug of the member to delete.
   *
   * @returns A null observable.
   */
  delete(orgSlug: string, memberSlug: string): Observable<null> {
    return this.http.delete<null>(
      OrgMemberService.baseApiUrl(orgSlug, memberSlug)
    );
  }
}