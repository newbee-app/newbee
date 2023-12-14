import { testOrganization1, testTeam1 } from '@newbee/shared/util';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { defaultUpToDateDuration } from './default-up-to-date-duration.function';

dayjs.extend(relativeTime);

describe('defaultUpToDateDuration', () => {
  it('should display team if team has duration, org otherwise', () => {
    const orgValue = `Mark blank to default to the organization's value of ${dayjs
      .duration(6, 'months')
      .humanize()}`;
    const teamValue = `Mark blank to default to the team's value of ${dayjs
      .duration(1, 'year')
      .humanize()}`;

    expect(defaultUpToDateDuration(testOrganization1, testTeam1)).toEqual(
      orgValue,
    );
    expect(
      defaultUpToDateDuration(testOrganization1, {
        ...testTeam1,
        upToDateDuration: 'P1Y',
      }),
    ).toEqual(teamValue);
    expect(defaultUpToDateDuration(testOrganization1)).toEqual(orgValue);
  });
});
