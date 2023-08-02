import {
  BaseCreateTeamDto,
  BaseTeamAndMemberDto,
  BaseUpdateTeamDto,
} from '@newbee/shared/data-access';
import { Keyword, Team } from '@newbee/shared/util';
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
    'Get Team Success': props<{ teamAndMemberDto: BaseTeamAndMemberDto }>(),

    /**
     * Create a team using the given information.
     */
    'Create Team': props<{ createTeamDto: BaseCreateTeamDto }>(),

    /**
     * Indicates that a team was successfully created.
     */
    'Create Team Success': props<{ team: Team }>(),

    /**
     * Edits the currently selected team with the given information.
     */
    'Edit Team': props<{ updateTeamDto: BaseUpdateTeamDto }>(),

    /**
     * Indicates that the currently selected team was successfully updated.
     */
    'Edit Team Success': props<{ newTeam: Team }>(),

    /**
     * Edits the currently selected team with a new slug.
     */
    'Edit Team Slug': props<{ updateTeamDto: BaseUpdateTeamDto }>(),

    /**
     * Indicates that the currently selected team was successfully updated with the new slug.
     */
    'Edit Team Slug Success': props<{ newTeam: Team }>(),

    /**
     * Send a request to the API to delete the currently selected team.
     */
    'Delete Team': emptyProps(),

    /**
     * Indicates that the currently selected team was successfully deleted.
     */
    'Delete Team Success': emptyProps(),

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
     * Reset the value for the selected team.
     */
    'Reset Selected Team': emptyProps(),
  },
});
