import { CreateOrgForm } from '@newbee/newbee/organization/util';
import type { Organization, OrgMemberNoUser } from '@newbee/shared/util';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

/**
 * All actions tied to `OrganizationState`.
 */
export const OrganizationActions = createActionGroup({
  source: 'Organization',
  events: {
    /**
     * Get the given organization and the user's relation to it, reaching out to the API if the necessary information is not in the store.
     * Should call `Get Org Success` with the result.
     */
    'Get Org': props<{ orgSlug: string }>(),

    /**
     * Indicates that an org was successfully retrieved.
     */
    'Get Org Success': props<{ orgMember: OrgMemberNoUser }>(),

    // TODO: change this to take form
    /**
     * Creates a new org with the given information.
     */
    'Create Org': props<{ createOrgForm: CreateOrgForm }>(),

    /**
     * Indicates that an org was successfully created.
     */
    'Create Org Success': props<{ organization: Organization }>(),

    /**
     * Set the selected org to be null.
     */
    'Reset Selected Org': emptyProps(),
  },
});
