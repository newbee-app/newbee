import { BaseCreateTeamDto, UrlEndpoint } from '@newbee/shared/data-access';
import type { Team } from '@newbee/shared/util';
import { createActionGroup, props } from '@ngrx/store';

/**
 * All actions tied to teams.
 */
export const TeamActions = createActionGroup({
  source: UrlEndpoint.Team,
  events: {
    /**
     * Create a team using the given information.
     */
    'Create Team': props<{ createTeamDto: BaseCreateTeamDto }>(),

    /**
     * Indicates that a team was successfully created.
     */
    'Create Team Success': props<{ team: Team }>(),

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
  },
});
