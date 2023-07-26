import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  apiVersion,
  BaseCreateTeamDto,
  BaseGeneratedSlugDto,
  BaseSlugTakenDto,
  BaseTeamAndMemberDto,
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
   * Sends a request to the API to get a team in the given organization with the given slug.
   *
   * @param slug The slug of the team to get.
   * @param orgSlug The slug of the org to look in.
   *
   * @returns An observable containing the team.
   */
  get(slug: string, orgSlug: string): Observable<BaseTeamAndMemberDto> {
    return this.http.get<BaseTeamAndMemberDto>(
      `/${Keyword.Api}/v${apiVersion.team}/${Keyword.Organization}/${orgSlug}/${Keyword.Team}/${slug}`
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
    return this.http.post<Team>(
      `/${Keyword.Api}/v${apiVersion.team}/${Keyword.Organization}/${orgSlug}/${Keyword.Team}`,
      createTeamDto
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
      `/${Keyword.Api}/v${apiVersion.team}/${Keyword.Organization}/${orgSlug}/${Keyword.Team}/${Keyword.CheckSlug}`,
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
      `/${Keyword.Api}/v${apiVersion.team}/${Keyword.Organization}/${orgSlug}/${Keyword.Team}/${Keyword.GenerateSlug}`,
      { params }
    );
  }
}
