import { Meta, StoryObj } from '@storybook/angular';
import { LoginFormComponent } from './login-form.component';

export default {
  title: 'LoginFormComponent',
  component: LoginFormComponent,
  args: {
    loginPending: false,
    magicLinkPending: false,
    httpClientError: null,
  },
  argTypes: {
    magicLinkLogin: { action: 'magicLinkLogin' },
    webauthn: { action: 'webauthn' },
    navigateToRegister: { action: 'navigateToRegister' },
  },
} as Meta<LoginFormComponent>;

type Story = StoryObj<LoginFormComponent>;

export const WithoutError: Story = {};

export const WithErrors: Story = {
  args: {
    httpClientError: {
      status: 500,
      messages: { email: 'Email error', misc: 'Misc error' },
    },
  },
};

export const Pending: Story = {
  args: {
    loginPending: true,
    magicLinkPending: true,
  },
};
