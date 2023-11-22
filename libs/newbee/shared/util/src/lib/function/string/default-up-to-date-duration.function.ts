import { Organization, Team } from '@newbee/shared/util';
import dayjs from 'dayjs';

/**
 * A helper function for form inputs that displays the default value for up-to-date duration, if left blank.
 *
 * @param organization The organization to default to.
 * @param team The team to default to, if any.
 *
 * @returns A string displaying what the up-to-date duration value will be, if left blank.
 */
export function defaultUpToDateDuration(
  organization: Organization,
  team: Team | null = null,
): string {
  return `Mark blank to default to the ${
    team?.upToDateDuration ? 'team' : 'organization'
  }'s value of ${dayjs
    .duration(team?.upToDateDuration ?? organization.upToDateDuration)
    .humanize()}`;
}
