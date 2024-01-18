import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiVersion } from '@newbee/shared/data-access';
import {
  BaseCreateTeamDto,
  BaseCreateTeamMemberDto,
  BaseGeneratedSlugDto,
  BaseSlugTakenDto,
  BaseTeamAndMemberDto,
  BaseUpdateTeamDto,
  BaseUpdateTeamMemberDto,
  DocQueryResult,
  Keyword,
  OffsetAndLimit,
  PaginatedResults,
  QnaQueryResult,
  Team,
  TeamMember,
  TeamMemberUserOrgMember,
} from '@newbee/shared/util';
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
   * Get the base API URL for dealing with a team member.
   *
   * @param orgSlug The slug of the org to look in.
   * @param teamSlug The slug of the team to look in.
   *
   * @returns The base API URL for dealing with a team member.
   */
  static baseTeamMemberApiUrl(orgSlug: string, teamSlug: string): string {
    return `${TeamService.baseApiUrl(orgSlug)}/${teamSlug}/${Keyword.Member}`;
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
      `${TeamService.baseApiUrl(orgSlug)}/${slug}`,
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
    updateTeamDto: BaseUpdateTeamDto,
  ): Observable<Team> {
    return this.http.patch<Team>(
      `${TeamService.baseApiUrl(orgSlug)}/${teamSlug}`,
      updateTeamDto,
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
      `${TeamService.baseApiUrl(orgSlug)}/${teamSlug}`,
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
      { params },
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
    orgSlug: string,
  ): Observable<BaseGeneratedSlugDto> {
    const params = new HttpParams({ fromObject: { base: name } });
    return this.http.get<BaseGeneratedSlugDto>(
      `${TeamService.baseApiUrl(orgSlug)}/${Keyword.GenerateSlug}`,
      { params },
    );
  }

  /**
   * Sends a request to the API to get all of the docs in the given org and team in a paginated format.
   *
   * @param orgSlug The org to look in.
   * @param teamSlug The team to look in.
   * @param offsetAndLimit The offset and limit for the request.
   *
   * @returns An observable containing the paginated docs.
   */
  getAllDocs(
    orgSlug: string,
    teamSlug: string,
    offsetAndLimit: OffsetAndLimit,
  ): Observable<PaginatedResults<DocQueryResult>> {
    const params = new HttpParams({ fromObject: { ...offsetAndLimit } });
    return this.http.get<PaginatedResults<DocQueryResult>>(
      `${TeamService.baseApiUrl(orgSlug)}/${teamSlug}/${Keyword.Doc}`,
      { params },
    );
  }

  /**
   * Sends a request to the API to get all of the qnas in the given org and team in a paginated format.
   *
   * @param orgSlug The org to look in.
   * @param teamSlug The team to look in.
   * @param offsetAndLimit The offset and limit for the request.
   *
   * @returns An observable containing the paginated qnas.
   */
  getAllQnas(
    orgSlug: string,
    teamSlug: string,
    offsetAndLimit: OffsetAndLimit,
  ): Observable<PaginatedResults<QnaQueryResult>> {
    const params = new HttpParams({ fromObject: { ...offsetAndLimit } });
    return this.http.get<PaginatedResults<QnaQueryResult>>(
      `${TeamService.baseApiUrl(orgSlug)}/${teamSlug}/${Keyword.Qna}`,
      { params },
    );
  }

  /**
   * Send a request to the API to create a new team member.
   *
   * @param createTeamMemberDto The details for the new team member.
   * @param orgSlug The slug of the org to look in.
   * @param teamSlug The slug of the team to add to.
   *
   * @returns An observable containing the newly created team member.
   */
  createTeamMember(
    createTeamMemberDto: BaseCreateTeamMemberDto,
    orgSlug: string,
    teamSlug: string,
  ): Observable<TeamMemberUserOrgMember> {
    return this.http.post<TeamMemberUserOrgMember>(
      TeamService.baseTeamMemberApiUrl(orgSlug, teamSlug),
      createTeamMemberDto,
    );
  }

  /**
   * Send a request to the API to edit an existing team member.
   *
   * @param updateTeamMemberDto The new details for the team member.
   * @param orgSlug The slug of the org to look in.
   * @param teamSlug The slug of the team to look in.
   * @param orgMemberSlug The slug of the org member to edit.
   *
   * @returns An observable containing the edited team member.
   */
  editTeamMember(
    updateTeamMemberDto: BaseUpdateTeamMemberDto,
    orgSlug: string,
    teamSlug: string,
    orgMemberSlug: string,
  ): Observable<TeamMember> {
    return this.http.patch<TeamMember>(
      `${TeamService.baseTeamMemberApiUrl(orgSlug, teamSlug)}/${orgMemberSlug}`,
      updateTeamMemberDto,
    );
  }

  /**
   * Send a request to the API to delete an existing team member.
   *
   * @param orgSlug The slug of the org to look in.
   * @param teamSlug The slug of the team to delete from.
   * @param orgMemberSlug The slug of the team member to delete.
   *
   * @returns A null observable.
   */
  deleteTeamMember(
    orgSlug: string,
    teamSlug: string,
    orgMemberSlug: string,
  ): Observable<null> {
    return this.http.delete<null>(
      `${TeamService.baseTeamMemberApiUrl(orgSlug, teamSlug)}/${orgMemberSlug}`,
    );
  }
}
