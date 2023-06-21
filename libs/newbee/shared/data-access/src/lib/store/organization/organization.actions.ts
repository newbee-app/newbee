import {
  BaseCreateOrganizationDto,
  BaseUpdateOrganizationDto,
} from '@newbee/shared/data-access';
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

    /**
     * Creates a new org with the given information.
     */
    'Create Org': props<{ createOrganizationDto: BaseCreateOrganizationDto }>(),

    /**
     * Indicates that an org was successfully created.
     */
    'Create Org Success': props<{ organization: Organization }>(),

    /**
     * Edits the currently selected organization with the given information.
     */
    'Edit Org': props<{ updateOrganizationDto: BaseUpdateOrganizationDto }>(),

    /**
     * Indicates that the currently selected org was successfully updated.
     */
    'Edit Org Success': props<{ newOrg: Organization }>(),

    /**
     * Edits the currently selected org with a new slug.
     */
    'Edit Org Slug': props<{
      updateOrganizationDto: BaseUpdateOrganizationDto;
    }>(),

    /**
     * Indicates that the currently selected org was successfully updated with the new slug.
     */
    'Edit Org Slug Success': props<{ newOrg: Organization }>(),

    /**
     * Send a request to the API to delete the currently selected org.
     */
    'Delete Org': emptyProps(),

    /**
     * Indicates that the currently selected org was successfully deleted.
     */
    'Delete Org Success': emptyProps(),

    /**
     * Indicates that a user is typing in a slug at the moment.
     */
    'Typing Slug': props<{ slug: string }>(),

    /**
     * Check whether an org slug is taken.
     */
    'Check Slug': props<{ slug: string }>(),

    /**
     * Indicates that the org slug was successfully checked.
     */
    'Check Slug Success': props<{ slugTaken: boolean }>(),

    /**
     * Generate a slug for user trying to create an organization.
     */
    'Generate Slug': props<{ name: string }>(),

    /**
     * Indicates that a slug was successfully generated.
     */
    'Generate Slug Success': props<{ slug: string }>(),

    /**
     * Set the selected org to be null.
     */
    'Reset Selected Org': emptyProps(),
  },
});
