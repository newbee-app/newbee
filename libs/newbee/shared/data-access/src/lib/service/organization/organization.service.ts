import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  organizationUrl,
  orgMemberUrl,
  orgMemberVersion,
} from '@newbee/shared/data-access';
import { OrgMemberNoUser } from '@newbee/shared/util';
import { Observable } from 'rxjs';

/**
 * The service tied to the API's organization-related endpoints.
 * Handles selecting the organization the user is currently looking at.
 */
@Injectable({ providedIn: 'root' })
export class OrganizationService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Gets and selects the organization associated with the given org slug.
   *
   * @param orgSlug The slug of the organization to get and select.
   * @returns An observable containing information about the organization and the user's relation to it.
   */
  getAndSelectOrg(orgSlug: string): Observable<OrgMemberNoUser> {
    return this.http.post<OrgMemberNoUser>(
      `/api/v${orgMemberVersion}/${organizationUrl}/${orgSlug}/${orgMemberUrl}`,
      {}
    );
  }
}
