import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  apiVersion,
  BaseCreateTeamDto,
  BaseGeneratedSlugDto,
  BaseSlugTakenDto,
  BaseTeamAndMemberDto,
  BaseUpdateTeamDto,
} from '@newbee/shared/data-access';
import { Keyword, Team } from '@newbee/shared/util';
import { Observable } from 'rxjs';

/**
 * The service tied to the API's team-related endpoints.
 * Handles CRUD for teams.
 */
@Injectable()
export class TeamService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get the base API URL for dealing with a team.
   *
   * @param orgSlug The slug of the org to look in.
   *
   * @returns The base API URL for dealing with a team.
   */
  static baseApiUrl(orgSlug: string): string {
    return `/${Keyword.Api}/v${apiVersion.team}/${Keyword.Organization}/${orgSlug}/${Keyword.Team}`;
  }

  /**
   * Sends a request to the API to get a team in the given organization with the given slug.
   *
   * @param slug The slug of the team to get.
   * @param orgSlug The slug of the org to look in.
   *
   * @returns An observable containing the team.
   */
  get(slug: string, orgSlug: string): Observable<BaseTeamAndMemberDto> {
    return this.http.get<BaseTeamAndMemberDto>(
      `${TeamService.baseApiUrl(orgSlug)}/${slug}`
    );
  }

  /**
   * Sends a request to the API to create a team in the given organization with the given information.
   *
   * @param createTeamDto The information for the new team.
   * @param orgSlug The slug of the organization to put the team in.
   *
   * @returns An observable containing the newly created team.
   */
  create(createTeamDto: BaseCreateTeamDto, orgSlug: string): Observable<Team> {
    return this.http.post<Team>(TeamService.baseApiUrl(orgSlug), createTeamDto);
  }

  /**
   * Send a request to the API to edit the given team in the given organization with the given information.
   *
   * @param orgSlug The slug of the org to look in.
   * @param teamSlug The slug of the team to look for.
   * @param updateTeamDto The new information for the team.
   *
   * @returns An observable containing the edited team.
   */
  edit(
    orgSlug: string,
    teamSlug: string,
    updateTeamDto: BaseUpdateTeamDto
  ): Observable<Team> {
    return this.http.patch<Team>(
      `${TeamService.baseApiUrl(orgSlug)}/${teamSlug}`,
      updateTeamDto
    );
  }

  /**
   * Send a request to the API to delete the given team in the given organization.
   *
   * @param orgSlug The slug of the org to look in.
   * @param teamSlug The slug of the team to look for.
   *
   * @returns A null observable.
   */
  delete(orgSlug: string, teamSlug: string): Observable<null> {
    return this.http.delete<null>(
      `${TeamService.baseApiUrl(orgSlug)}/${teamSlug}`
    );
  }

  /**
   * Send a request to the API to check whether the slug is taken in the org.
   *
   * @param slug The team slug to check.
   * @param orgSlug The slug of the org to check in.
   *
   * @returns An observable containing a boolean that is `true` if the slug is taken, `false` otherwise.
   */
  checkSlug(slug: string, orgSlug: string): Observable<BaseSlugTakenDto> {
    const params = new HttpParams({ fromObject: { slug } });
    return this.http.get<BaseSlugTakenDto>(
      `${TeamService.baseApiUrl(orgSlug)}/${Keyword.CheckSlug}`,
      { params }
    );
  }

  /**
   * Send a request to the API to generate a slug using the given name as a base.
   *
   * @param name The team name to act as a base for the slug.
   * @param orgSlug The slug of the org to check in.
   *
   * @returns An observable containing the generated slug.
   */
  generateSlug(
    name: string,
    orgSlug: string
  ): Observable<BaseGeneratedSlugDto> {
    const params = new HttpParams({ fromObject: { base: name } });
    return this.http.get<BaseGeneratedSlugDto>(
      `${TeamService.baseApiUrl(orgSlug)}/${Keyword.GenerateSlug}`,
      { params }
    );
  }
}
