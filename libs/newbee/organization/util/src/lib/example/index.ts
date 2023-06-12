import { testOrganization1 } from '@newbee/shared/util';
import { OrgForm } from '../interface';

const { name, slug } = testOrganization1;

/**
 * An example instance of `OrgForm`.
 * Strictly for use in testing.
 */
export const testOrgForm1: OrgForm = { name, slug };
