import {
  CreateOrgMemberInviteDto,
  CreatorOrMaintainer,
  DocQueryResult,
  Keyword,
  OrgMember,
  PaginatedResults,
  QnaQueryResult,
  UpdateOrgMemberDto,
  type OrgMemberNoOrg,
} from '@newbee/shared/util';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

/**
 * All actions tied to `OrgMemberState`.
 */
export const OrgMemberActions = createActionGroup({
  source: Keyword.Member,
  events: {
    /**
     * Gets the org member associated with the given slug.
     * Should call `Get Org Member Success` with the result.
     */
    'Get Org Member': props<{ slug: string }>(),

    /**
     * Indicates that an org member was successfully retrieved.
     */
    'Get Org Member Success': props<{ orgMember: OrgMemberNoOrg }>(),

    /**
     * Edits the selected org member with the given information.
     * Should call `Edit Org Member Success` with the result.
     */
    'Edit Org Member': props<{ updateOrgMemberDto: UpdateOrgMemberDto }>(),

    /**
     * Indicates that an org member was successfully updated.
     */
    'Edit Org Member Success': props<{ orgMember: OrgMember }>(),

    /**
     * Deletes the selected org member.
     * Should call `Delete Org Member Success` if successful.
     */
    'Delete Org Member': emptyProps(),

    /**
     * Indicates that the selected org member was successfully deleted.
     */
    'Delete Org Member Success': emptyProps(),

    /**
     * Gets all of the paginated docs of the selected org member.
     */
    'Get Docs': props<{ role: CreatorOrMaintainer | null }>(),

    /**
     * Indicates that the get docs action is pending.
     */
    'Get Docs Pending': props<{ role: CreatorOrMaintainer | null }>(),

    /**
     * Indicates that the paginated docs were successfully retrieved.
     */
    'Get Docs Success': props<{ docs: PaginatedResults<DocQueryResult> }>(),

    /**
     * Gets all of the paginated qnas of the selected org member.
     */
    'Get Qnas': props<{ role: CreatorOrMaintainer | null }>(),

    /**
     * Indicates that the get qnas action is pending.
     */
    'Get Qnas Pending': props<{ role: CreatorOrMaintainer | null }>(),

    /**
     * Indicates that the paginated qnas were successfully retrieved.
     */
    'Get Qnas Success': props<{ qnas: PaginatedResults<QnaQueryResult> }>(),

    /**
     * Invite a user to an org.
     */
    'Invite User': props<{
      createOrgMemberInviteDto: CreateOrgMemberInviteDto;
    }>(),

    /**
     * Indicates that an invite was successfully sent to the given email.
     */
    'Invite User Success': props<{ email: string }>(),

    /**
     * Set the selected org member to be null.
     */
    'Reset Selected Org Member': emptyProps(),
  },
});
