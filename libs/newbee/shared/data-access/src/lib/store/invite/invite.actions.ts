import { Keyword, OrgMemberNoUser, TokenDto } from '@newbee/shared/util';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

/**
 * All actions tied to inviting users to an org.
 */
export const InviteActions = createActionGroup({
  source: Keyword.Invite,
  events: {
    /**
     * Accept the given org invite.
     */
    'Accept Invite': props<{ tokenDto: TokenDto }>(),

    /**
     * Indicates that the org invite was successfully accepted.
     */
    'Accept Invite Success': props<{ orgMember: OrgMemberNoUser }>(),

    /**
     * Decline the given org invite.
     */
    'Decline Invite': props<{ tokenDto: TokenDto }>(),

    /**
     * Indicates that the org invite was successfully declined.
     */
    'Decline Invite Success': emptyProps(),
  },
});
