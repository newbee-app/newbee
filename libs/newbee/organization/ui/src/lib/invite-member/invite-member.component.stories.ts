import { ClickWrapperComponent } from '@newbee/newbee/shared/ui';
import { OrgRoleEnum, testOrgMember1, testUser1 } from '@newbee/shared/util';
import {
  Meta,
  StoryObj,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import { InviteMemberComponent } from './invite-member.component';

export default {
  title: 'InviteMemberComponent',
  component: InviteMemberComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`,
    ),
  ],
  args: {
    orgMember: testOrgMember1,
    invitePending: false,
    invitedUser: '',
    httpClientError: null,
  },
  argTypes: {
    invite: { action: 'invite' },
  },
} as Meta<InviteMemberComponent>;

type Story = StoryObj<InviteMemberComponent>;

export const Owner: Story = {};

export const Moderator: Story = {
  args: { orgMember: { ...testOrgMember1, role: OrgRoleEnum.Moderator } },
};

export const Member: Story = {
  args: { orgMember: { ...testOrgMember1, role: OrgRoleEnum.Member } },
};

export const InvitePending: Story = { args: { invitePending: true } };

export const InvitedUser: Story = { args: { invitedUser: testUser1.email } };

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
