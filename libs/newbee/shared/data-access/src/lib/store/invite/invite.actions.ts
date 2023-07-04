import { BaseTokenDto, UrlEndpoint } from '@newbee/shared/data-access';
import { OrgMemberNoUser } from '@newbee/shared/util';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const InviteActions = createActionGroup({
  source: UrlEndpoint.Invite,
  events: {
    /**
     * Accept the given org invite.
     */
    'Accept Invite': props<{ tokenDto: BaseTokenDto }>(),

    /**
     * Indicates that the org invite was successfully accepted.
     */
    'Accept Invite Success': props<{ orgMember: OrgMemberNoUser }>(),

    /**
     * Decline the given org invite.
     */
    'Decline Invite': props<{ tokenDto: BaseTokenDto }>(),

    /**
     * Indicates that the org invite was successfully declined.
     */
    'Decline Invite Success': emptyProps(),
  },
});
