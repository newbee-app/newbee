import { ClickWrapperComponent } from '@newbee/newbee/shared/ui';
import {
  testDocRelation1,
  testQnaRelation1,
  testTeamMember1,
  testTeamMemberRelation1,
  testTeamRelation1,
} from '@newbee/shared/util';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { ViewTeamComponent } from './view-team.component';

export default {
  title: 'ViewTeamComponent',
  component: ViewTeamComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`
    ),
  ],
  args: {
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
        sample: [testQnaRelation1, testQnaRelation1, testQnaRelation1],
        total: 100,
      },
      docs: {
        sample: [testDocRelation1, testDocRelation1, testDocRelation1],
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
