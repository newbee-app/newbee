import {
  CreateTeamDto,
  CreateTeamMemberDto,
  DocSearchResult,
  Keyword,
  Organization,
  PaginatedResults,
  QnaSearchResult,
  Team,
  TeamAndMemberDto,
  TeamMember,
  TeamMemberUserOrgMember,
  UpdateTeamDto,
  UpdateTeamMemberDto,
} from '@newbee/shared/util';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

/**
 * All actions tied to teams.
 */
export const TeamActions = createActionGroup({
  source: Keyword.Team,
  events: {
    /**
     * Gets the team associated with the provided slug.
     */
    'Get Team': props<{ slug: string }>(),

    /**
     * Indiciates that a team was successfully retrieved.
     */
    'Get Team Success': props<{ teamAndMemberDto: TeamAndMemberDto }>(),

    /**
     * Create a team using the given information.
     */
    'Create Team': props<{ createTeamDto: CreateTeamDto }>(),

    /**
     * Indicates that a team was successfully created.
     */
    'Create Team Success': props<{ organization: Organization; team: Team }>(),

    /**
     * Edits the currently selected team with the given information.
     */
    'Edit Team': props<{ updateTeamDto: UpdateTeamDto }>(),

    /**
     * Indicates that the currently selected team was successfully updated.
     */
    'Edit Team Success': props<{ oldSlug: string; newTeam: Team }>(),

    /**
     * Edits the currently selected team with a new slug.
     */
    'Edit Team Slug': props<{ updateTeamDto: UpdateTeamDto }>(),

    /**
     * Indicates that the currently selected team was successfully updated with the new slug.
     */
    'Edit Team Slug Success': props<{ oldSlug: string; newTeam: Team }>(),

    /**
     * Send a request to the API to delete the currently selected team.
     */
    'Delete Team': emptyProps(),

    /**
     * Indicates that the currently selected team was successfully deleted.
     */
    'Delete Team Success': props<{ slug: string }>(),

    /**
     * Indicates that a user is typing in a slug at the moment.
     */
    'Typing Slug': props<{ slug: string }>(),

    /**
     * Checks whether a team slug is taken.
     */
    'Check Slug': props<{ slug: string }>(),

    /**
     * Indicates that the team slug was successfully checked.
     */
    'Check Slug Success': props<{ slugTaken: boolean }>(),

    /**
     * Generate a slug for a team based on its name and availability.
     */
    'Generate Slug': props<{ name: string }>(),

    /**
     * Indicates that a slug was successfully generated.
     */
    'Generate Slug Success': props<{ slug: string }>(),

    /**
     * Gets all of the paginated docs of the selected team.
     */
    'Get Docs': emptyProps(),

    /**
     * Indicates that the get docs action is pending.
     */
    'Get Docs Pending': emptyProps(),

    /**
     * Indicates that the paginated docs were successfully retrieved.
     */
    'Get Docs Success': props<{ docs: PaginatedResults<DocSearchResult> }>(),

    /**
     * Gets all of the paginated qnas of the selected team.
     */
    'Get Qnas': emptyProps(),

    /**
     * Indicates that the get qnas action is pending.
     */
    'Get Qnas Pending': emptyProps(),

    /**
     * Indicates that the paginated qnas were successfully retrieved.
     */
    'Get Qnas Success': props<{ qnas: PaginatedResults<QnaSearchResult> }>(),

    /**
     * Add a new team member to the team.
     */
    'Add Team Member': props<{
      createTeamMemberDto: CreateTeamMemberDto;
    }>(),

    /**
     * Indicates that a team member was successfully added to the team.
     */
    'Add Team Member Success': props<{ teamMember: TeamMemberUserOrgMember }>(),

    /**
     * Edit an existing team member.
     */
    'Edit Team Member': props<{
      orgMemberSlug: string;
      updateTeamMemberDto: UpdateTeamMemberDto;
    }>(),

    /**
     * Indicates that an existing team member was successfully edited.
     */
    'Edit Team Member Success': props<{
      orgMemberSlug: string;
      teamMember: TeamMember;
    }>(),

    /**
     * Delete an existing team member.
     */
    'Delete Team Member': props<{ orgMemberSlug: string }>(),

    /**
     * Indicates that a team member was successfully removed from the team.
     */
    'Delete Team Member Success': props<{ orgMemberSlug: string }>(),

    /**
     * Change the value for the current `teamMember`.
     */
    'Edit Current Team Member': props<{ teamMember: TeamMember | null }>(),

    /**
     * Reset the value for the selected team.
     */
    'Reset Selected Team': emptyProps(),
  },
});
