import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

/**
 * The default duration for an org.
 */
export const defaultOrgDuration = dayjs.duration(6, 'months');

/**
 * The default limit for retrieving search results.
 */
export const defaultLimit = 10;
