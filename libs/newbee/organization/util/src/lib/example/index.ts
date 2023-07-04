import { OrgRoleEnum, testOrganization1, testUser1 } from '@newbee/shared/util';
import type {
  CreateOrgForm,
  EditOrgForm,
  EditOrgSlugForm,
  InviteMemberForm,
} from '../interface';

const { name, slug } = testOrganization1;

/**
 * An example instance of `CreateOrgForm`.
 * Strictly for use in testing.
 */
export const testCreateOrgForm1: CreateOrgForm = { name, slug };

/**
 * An example instance of `EditOrgForm`.
 * Strictly for use in testing.
 */
export const testEditOrgForm1: EditOrgForm = { name };

/**
 * An example instance of `EditOrgSlugForm`.
 * Strictly for use in testing.
 */
export const testEditOrgSlugForm1: EditOrgSlugForm = { slug };

/**
 * An example instance of `InviteMemberForm`.
 * Strictly for use in testing.
 */
export const testInviteMemberForm1: InviteMemberForm = {
  email: testUser1.email,
  role: OrgRoleEnum.Member,
};
