import { testBaseMagicLinkLoginDto1 } from '@newbee/shared/data-access';
import { Meta, StoryObj } from '@storybook/angular';
import { JwtIdComponent } from './jwt-id.component';

export default {
  title: 'JwtIdComponent',
  component: JwtIdComponent,
  args: {
    jwtId: testBaseMagicLinkLoginDto1.jwtId,
    email: testBaseMagicLinkLoginDto1.email,
    httpClientError: null,
  },
  argTypes: {
    resendLink: { action: 'resendLink' },
  },
} as Meta<JwtIdComponent>;

type Story = StoryObj<JwtIdComponent>;

export const NoError: Story = {};

export const WithError: Story = {
  args: {
    httpClientError: { status: 500, messages: { misc: 'Misc error' } },
  },
};
