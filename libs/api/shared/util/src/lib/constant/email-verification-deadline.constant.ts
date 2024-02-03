import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

/**
 * The duration before a newly created user will be forced to verify their email to access non-public routes.
 */
export const emailVerificationDeadline = dayjs.duration('P7D');
