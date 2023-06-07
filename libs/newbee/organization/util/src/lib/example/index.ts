import { testOrganization1 } from '@newbee/shared/util';
import { CreateOrgForm } from '../interface';

const { name, slug } = testOrganization1;

/**
 * An example instance of `CreateOrgForm`.
 * Strictly for use in testing.
 */
export const testCreateOrgForm1: CreateOrgForm = { name, slug };
