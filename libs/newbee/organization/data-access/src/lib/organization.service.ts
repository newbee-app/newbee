import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  apiVersion,
  BaseCreateOrganizationDto,
  BaseCreateOrgMemberInviteDto,
  BaseGeneratedSlugDto,
  BaseOrgAndMemberDto,
  BaseSlugTakenDto,
  BaseUpdateOrganizationDto,
} from '@newbee/shared/data-access';
import { Keyword, Organization } from '@newbee/shared/util';
import { Observable } from 'rxjs';

/**
 * The service tied to the API's organization-related endpoints.
 * Handles CRUD for organizations.
 */
@Injectable()
export class OrganizationService {
  /**
   * The base API URL for dealing with orgs.
   */
  static baseApiUrl = `/${Keyword.Api}/v${apiVersion.organization}/${Keyword.Organization}`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Sends a request to the API to get the organization associated with the given slug.
   *
   * @param slug The slug of the organization to get.
   *
   * @returns An observable containing information about the organization and the requester's relation to it.
   */
  get(slug: string): Observable<BaseOrgAndMemberDto> {
    return this.http.get<BaseOrgAndMemberDto>(
      `${OrganizationService.baseApiUrl}/${slug}`
    );
  }

  /**
   * Send a request to the API to create a new organization with the given information.
   *
   * @param createOrganizationDto The DTO containing the necessary information to create a new org.
   *
   * @returns An observable with information about the new organization.
   */
  create(
    createOrganizationDto: BaseCreateOrganizationDto
  ): Observable<Organization> {
    return this.http.post<Organization>(
      OrganizationService.baseApiUrl,
      createOrganizationDto
    );
  }

  /**
   * Send a request to the API to edit an existing organization with the given information.
   *
   * @param updateOrganizationDto The DTO containing the necessary information to edit an existing org.
   *
   * @returns An observable with information about the edited organization.
   */
  edit(
    orgSlug: string,
    updateOrganizationDto: BaseUpdateOrganizationDto
  ): Observable<Organization> {
    return this.http.patch<Organization>(
      `${OrganizationService.baseApiUrl}/${orgSlug}`,
      updateOrganizationDto
    );
  }

  /**
   * Send a request to the API to delete an existing organization.
   *
   * @param orgSlug The slug of the organization to delete.
   *
   * @returns A null observable.
   */
  delete(orgSlug: string): Observable<null> {
    return this.http.delete<null>(
      `${OrganizationService.baseApiUrl}/${orgSlug}`
    );
  }

  /**
   * Send a request to the API to check whether the slug is taken.
   *
   * @param slug The org slug to check.
   *
   * @returns An observable containing a boolean that is `true` if the slug is taken, `false` otherwise.
   */
  checkSlug(slug: string): Observable<BaseSlugTakenDto> {
    const params = new HttpParams({ fromObject: { slug } });
    return this.http.get<BaseSlugTakenDto>(
      `${OrganizationService.baseApiUrl}/${Keyword.CheckSlug}`,
      { params }
    );
  }

  /**
   * Send a request to the API to generate a slug using the given name as a base.
   *
   * @param name The organization name to act as a base for the slug.
   *
   * @returns An observable containing the generated slug.
   */
  generateSlug(name: string): Observable<BaseGeneratedSlugDto> {
    const params = new HttpParams({ fromObject: { base: name } });
    return this.http.get<BaseGeneratedSlugDto>(
      `${OrganizationService.baseApiUrl}/${Keyword.GenerateSlug}`,
      { params }
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
    createOrgMemberInviteDto: BaseCreateOrgMemberInviteDto
  ): Observable<null> {
    return this.http.post<null>(
      `${OrganizationService.baseApiUrl}/${orgSlug}`,
      createOrgMemberInviteDto
    );
  }
}
