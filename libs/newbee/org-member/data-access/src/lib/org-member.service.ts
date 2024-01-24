import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrganizationService } from '@newbee/newbee/organization/data-access';
import { apiVersion } from '@newbee/shared/data-access';
import {
  BaseCreateOrgMemberInviteDto,
  BaseGetOrgMemberPostsDto,
  BaseUpdateOrgMemberDto,
  DocQueryResult,
  Keyword,
  OrgMember,
  OrgMemberNoOrg,
  PaginatedResults,
  QnaQueryResult,
} from '@newbee/shared/util';
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
    return `/${Keyword.Api}/v${apiVersion['org-member']}/${Keyword.Organization}/${orgSlug}/${Keyword.Member}/${memberSlug}`;
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
      OrgMemberService.baseApiUrl(orgSlug, memberSlug),
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
    updateOrgMemberDto: BaseUpdateOrgMemberDto,
  ): Observable<OrgMember> {
    return this.http.patch<OrgMember>(
      OrgMemberService.baseApiUrl(orgSlug, memberSlug),
      updateOrgMemberDto,
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
      OrgMemberService.baseApiUrl(orgSlug, memberSlug),
    );
  }

  /**
   * Sends a request to the API to get all of the docs of the given org member in a paginated format.
   *
   * @param orgSlug The org to look in.
   * @param memberSlug The org member whose docs to get.
   * @param getOrgMemberPostsDto The information needed to request the org member's docs.
   *
   * @returns An observable containing the paginated docs.
   */
  getAllDocs(
    orgSlug: string,
    memberSlug: string,
    getOrgMemberPostsDto: BaseGetOrgMemberPostsDto,
  ): Observable<PaginatedResults<DocQueryResult>> {
    const params = new HttpParams({ fromObject: { ...getOrgMemberPostsDto } });
    return this.http.get<PaginatedResults<DocQueryResult>>(
      `${OrgMemberService.baseApiUrl(orgSlug, memberSlug)}/${Keyword.Doc}`,
      { params },
    );
  }

  /**
   * Sends a request to the API to get all of the qnas of the given org member in a paginated format.
   *
   * @param orgSlug The org to look in.
   * @param memberSlug The org member whose qnas to get.
   * @param getOrgMemberPostsDto The information needed to request the org member's qnas.
   *
   * @returns An observable containing the paginated qnas.
   */
  getAllQnas(
    orgSlug: string,
    memberSlug: string,
    getOrgMemberPostsDto: BaseGetOrgMemberPostsDto,
  ): Observable<PaginatedResults<QnaQueryResult>> {
    const params = new HttpParams({ fromObject: { ...getOrgMemberPostsDto } });
    return this.http.get<PaginatedResults<QnaQueryResult>>(
      `${OrgMemberService.baseApiUrl(orgSlug, memberSlug)}/${Keyword.Qna}`,
      { params },
    );
  }

  /**
   * Send a request to the API to invite a user to the org.
   *
   * @param orgSlug The org to invite the user to.
   * @param createOrgMemberInviteDto The email address and role the invited user should have.
   *
   * @returns A null observable.
   */
  inviteUser(
    orgSlug: string,
    createOrgMemberInviteDto: BaseCreateOrgMemberInviteDto,
  ): Observable<null> {
    return this.http.post<null>(
      `${OrganizationService.baseApiUrl}/${orgSlug}`,
      createOrgMemberInviteDto,
    );
  }
}
