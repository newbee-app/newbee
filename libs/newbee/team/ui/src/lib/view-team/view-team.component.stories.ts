import { ClickWrapperComponent } from '@newbee/newbee/shared/ui';
import {
  testDocQueryResult1,
  testOrganization1,
  testQnaQueryResult1,
  testTeam1,
  testTeamMember1,
  testTeamMemberRelation1,
  testTeamRelation1,
} from '@newbee/shared/util';
import {
  Meta,
  StoryObj,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import { ViewTeamComponent } from './view-team.component';

export default {
  title: 'ViewTeamComponent',
  component: ViewTeamComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`,
    ),
  ],
  args: {
    organization: testOrganization1,
    team: {
      ...testTeamRelation1,
      teamMembers: {
        sample: [
          testTeamMemberRelation1,
          testTeamMemberRelation1,
          testTeamMemberRelation1,
          testTeamMemberRelation1,
          testTeamMemberRelation1,
        ],
        total: 100,
      },
      qnas: {
        sample: [testQnaQueryResult1, testQnaQueryResult1, testQnaQueryResult1],
        total: 100,
      },
      docs: {
        sample: [testDocQueryResult1, testDocQueryResult1, testDocQueryResult1],
        total: 100,
      },
    },
    teamMember: testTeamMember1,
  },
  argTypes: {
    orgNavigate: { action: 'orgNavigate' },
    teamNavigate: { action: 'teamNavigate' },
  },
} as Meta<ViewTeamComponent>;

type Story = StoryObj<ViewTeamComponent>;

export const Primary: Story = {};

export const NoTeamMember: Story = { args: { teamMember: null } };

export const LongTeamName: Story = {
  args: {
    team: {
      ...testTeamRelation1,
      team: {
        ...testTeam1,
        name: 'Really really really really really really really really long team name',
      },
    },
  },
};
