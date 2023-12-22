import { ClickWrapperComponent } from '@newbee/newbee/shared/ui';
import {
  testOrgMember1,
  testOrgMemberUser1,
  testOrgMemberUser2,
  testTeamMember1,
  testTeamMemberRelation1,
  testTeamMemberRelation2,
} from '@newbee/shared/util';
import {
  Meta,
  StoryObj,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import { ViewTeamMembersComponent } from './view-team-members.component';

export default {
  title: 'ViewTeamMembersComponent',
  component: ViewTeamMembersComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`,
    ),
  ],
  args: {
    orgMember: testOrgMember1,
    teamMember: testTeamMember1,
    teamMembers: [testTeamMemberRelation1, testTeamMemberRelation2],
    orgMembers: [testOrgMemberUser1, testOrgMemberUser2],
    addedUser: null,
    addMemberPending: false,
    deleteMemberPending: new Map<string, boolean>(),
    httpClientError: null,
  },
  argTypes: {
    addTeamMember: { action: 'invite' },
    deleteTeamMember: { action: 'deleteTeamMember' },
    orgNavigate: { action: 'orgNavigate' },
  },
} as Meta<ViewTeamMembersComponent>;

type Story = StoryObj<ViewTeamMembersComponent>;

export const Primary: Story = {};

export const LotsOfOrgMembers: Story = {
  args: {
    orgMembers: [
      testOrgMemberUser1,
      testOrgMemberUser1,
      testOrgMemberUser1,
      testOrgMemberUser1,
      testOrgMemberUser1,
      testOrgMemberUser1,
      testOrgMemberUser1,
      testOrgMemberUser1,
      testOrgMemberUser1,
      testOrgMemberUser1,
      testOrgMemberUser1,
      testOrgMemberUser1,
      testOrgMemberUser1,
      testOrgMemberUser1,
      testOrgMemberUser1,
      testOrgMemberUser1,
      testOrgMemberUser1,
      testOrgMemberUser1,
      testOrgMemberUser1,
      testOrgMemberUser1,
    ],
  },
};

export const LotsOfTeamMembers: Story = {
  args: {
    teamMembers: [
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
    ],
  },
};
