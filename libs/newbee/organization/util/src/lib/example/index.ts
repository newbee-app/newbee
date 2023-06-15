import { testOrganization1 } from '@newbee/shared/util';
import { CreateOrgForm, EditOrgForm, EditOrgSlugForm } from '../interface';

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
