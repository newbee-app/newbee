import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { CreateOrgForm } from '@newbee/newbee/organization/util';
import {
  BaseCreateOrganizationDto,
  BaseGeneratedSlugDto,
  BaseSlugTakenDto,
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
    return { name: name ?? '', slug: slug ?? '' };
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
      `/${UrlEndpoint.Api}/v${organizationVersion}/${UrlEndpoint.Organization}/${slug}`
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
      `/${UrlEndpoint.Api}/v${organizationVersion}/${UrlEndpoint.Organization}`,
      createOrganizationDto
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
      `/${UrlEndpoint.Api}/v${organizationVersion}/${UrlEndpoint.Organization}/${UrlEndpoint.CheckSlug}`,
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
      `/${UrlEndpoint.Api}/v${organizationVersion}/${UrlEndpoint.Organization}/${UrlEndpoint.GenerateSlug}`,
      { params }
    );
  }
}
