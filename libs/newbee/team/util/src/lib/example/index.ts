import { testTeam1 } from '@newbee/shared/util';
import type { CreateTeamForm } from '../interface';

const { name, slug } = testTeam1;

/**
 * An example instance of `CreateTeamForm`.
 * Strictly for use in testing.
 */
export const testCreateTeamForm1: CreateTeamForm = { name, slug };
