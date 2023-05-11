import type { OrgMemberNoUser } from '@newbee/shared/util';
import { createActionGroup, props } from '@ngrx/store';

/**
 * All actions tied to `OrganizationState`.
 */
export const OrganizationActions = createActionGroup({
  source: 'Organization',
  events: {
    /**
     * Send a request to the API to get and select the given organization.
     * If the slug is null, it should skip the API.
     * Should call `Get And Select Org Success` with the result.
     */
    'Get And Select Org': props<{ orgSlug: string | null }>(),

    /**
     * Indicates that an org was successfully retrieved and selected.
     */
    'Get And Select Org Success': props<{
      orgMember: OrgMemberNoUser | null;
    }>(),
  },
});
