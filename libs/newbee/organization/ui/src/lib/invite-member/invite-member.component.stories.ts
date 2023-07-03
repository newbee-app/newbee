import { ClickWrapperComponent } from '@newbee/newbee/shared/ui';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { InviteMemberComponent } from './invite-member.component';

export default {
  title: 'InviteMemberComponent',
  component: InviteMemberComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`
    ),
  ],
  args: {
    invitePending: false,
    httpClientError: null,
  },
  argTypes: {
    invite: { action: 'invite' },
  },
} as Meta<InviteMemberComponent>;

type Story = StoryObj<InviteMemberComponent>;

export const Primary: Story = {};

export const InvitePending: Story = { args: { invitePending: true } };

export const HttpError: Story = {
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
