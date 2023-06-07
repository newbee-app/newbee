import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { CreateOrgForm } from '@newbee/newbee/organization/util';
import {
  BaseCreateOrganizationDto,
  organizationVersion,
  UrlEndpoint,
} from '@newbee/shared/data-access';
import type { Organization, OrgMemberNoUser } from '@newbee/shared/util';
import { Observable } from 'rxjs';

/**
 * The service tied to the API's organization-related endpoints.
 * Handles selecting the organization the user is currently looking at.
 */
@Injectable()
export class OrganizationService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Converts a `CreateOrgForm` to a `BaseCreateOrganizationDto`.
   *
   * @param createOrgForm The form to convert.
   *
   * @returns The form as a DTO.
   */
  private static createOrgFormToCreateOrganizationDto(
    createOrgForm: CreateOrgForm
  ): BaseCreateOrganizationDto {
    const { name, slug } = createOrgForm;
    return { name: name ?? '', slug: slug ?? null };
  }

  /**
   * Sends a request to the API to get the organization associated with the given slug.
   *
   * @param slug The slug of the organization to get.
   *
   * @returns An observable containing information about the organization and the requester's relation to it.
   */
  get(slug: string): Observable<OrgMemberNoUser> {
    return this.http.get<OrgMemberNoUser>(
      `/api/v${organizationVersion}/${UrlEndpoint.Organization}/${slug}`
    );
  }

  /**
   * Send a request to the API to create a new organization with the given information.
   *
   * @param createOrgForm The form containing the necessary information to create a new org.
   *
   * @returns An observable with information about the new organization.
   */
  create(createOrgForm: CreateOrgForm): Observable<Organization> {
    const createOrganizationDto =
      OrganizationService.createOrgFormToCreateOrganizationDto(createOrgForm);
    return this.http.post<Organization>(
      `/api/v${organizationVersion}/${UrlEndpoint.Organization}`,
      createOrganizationDto
    );
  }
}
