import { ClickWrapperComponent } from '@newbee/newbee/shared/ui';
import {
  Keyword,
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
    addTeamMemberPending: false,
    editTeamMemberPending: new Set(),
    deleteTeamMemberPending: new Set(),
    httpClientError: null,
  },
  argTypes: {
    addTeamMember: { action: 'invite' },
    editTeamMember: { action: 'editTeamMember' },
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

export const Pending: Story = {
  args: {
    editTeamMemberPending: new Set([testTeamMemberRelation1.orgMember.slug]),
    deleteTeamMemberPending: new Set([testTeamMemberRelation1.orgMember.slug]),
  },
};

export const Errors: Story = {
  args: {
    httpClientError: {
      status: 400,
      messages: {
        [`${Keyword.TeamMember}-${Keyword.New}`]: 'new team member error',
        [`${Keyword.TeamMember}-${Keyword.Edit}-${testTeamMemberRelation1.orgMember.slug}`]:
          'org member 1 team member edit error',
        [`${Keyword.TeamMember}-${Keyword.Delete}-${testTeamMemberRelation1.orgMember.slug}`]:
          'org member 1 team member delete error',
      },
    },
  },
};
