import { ClickWrapperComponent } from '@newbee/newbee/shared/ui';
import {
  OrgRoleEnum,
  testOrgMember1,
  testOrgMemberUser1,
  testOrgMemberUser2,
} from '@newbee/shared/util';
import {
  Meta,
  StoryObj,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import { ViewOrgMembersComponent } from './view-org-members.component';

export default {
  title: 'ViewOrgMembersComponent',
  component: ViewOrgMembersComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`,
    ),
  ],
  args: {
    orgMember: testOrgMember1,
    orgMembers: [testOrgMemberUser1, testOrgMemberUser2],
    invitePending: false,
    invitedUserEmail: '',
    httpClientError: null,
  },
  argTypes: {
    invite: { action: 'invite' },
    orgNavigate: { action: 'orgNavigate' },
  },
} as Meta<ViewOrgMembersComponent>;

type Story = StoryObj<ViewOrgMembersComponent>;

export const Owner: Story = {};

export const Moderator: Story = {
  args: { orgMember: { ...testOrgMember1, role: OrgRoleEnum.Moderator } },
};

export const Member: Story = {
  args: { orgMember: { ...testOrgMember1, role: OrgRoleEnum.Member } },
};

export const InvitePending: Story = { args: { invitePending: true } };

export const WithErrors: Story = {
  args: {
    httpClientError: {
      status: 500,
      messages: {
        email: 'Email error',
        role: 'Role error',
        misc: 'Misc error',
      },
    },
  },
};
