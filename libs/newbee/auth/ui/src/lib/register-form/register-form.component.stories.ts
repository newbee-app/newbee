import { ClickWrapperComponent } from '@newbee/newbee/shared/ui';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { RegisterFormComponent } from './register-form.component';

export default {
  title: 'RegisterFormComponent',
  component: RegisterFormComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`
    ),
  ],
  args: {
    registerPending: false,
    httpClientError: null,
  },
  argTypes: {
    register: { action: 'register' },
    navigateToLogin: { action: 'navigateToLogin' },
  },
} as Meta<RegisterFormComponent>;

type Story = StoryObj<RegisterFormComponent>;

export const WithoutErrors: Story = {};

export const WithErrors: Story = {
  args: {
    httpClientError: {
      status: 400,
      messages: {
        email: 'Email error',
        name: 'Name error',
        displayName: 'Display name error',
        phoneNumber: 'Phone number error',
        misc: 'Misc error',
      },
    },
  },
};

export const Pending: Story = { args: { registerPending: true } };
