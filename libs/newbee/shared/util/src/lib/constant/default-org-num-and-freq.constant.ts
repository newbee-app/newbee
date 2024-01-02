import { defaultOrgDuration } from '@newbee/shared/util';
import { durationToNumAndFreq } from '../function';

/**
 * The default num and freq for an org.
 */
export const defaultOrgNumAndFreq = durationToNumAndFreq(defaultOrgDuration);
