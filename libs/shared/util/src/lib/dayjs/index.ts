import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

// The dayjs module loaded with all of the plugins that we care about for NewBee.
export { dayjs as nbDayjs };
