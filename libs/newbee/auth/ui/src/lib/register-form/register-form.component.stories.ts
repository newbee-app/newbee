import {
  displayNameIsNotEmpty,
  internalServerError,
  nameIsNotEmpty,
  phoneNumberIsPhoneNumber,
  userEmailTakenBadRequest,
} from '@newbee/shared/util';
import { componentWrapperDecorator, Meta, StoryObj } from '@storybook/angular';
import { RegisterFormComponent } from './register-form.component';

export default {
  title: 'RegisterFormComponent',
  component: RegisterFormComponent,
  decorators: [
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
        email: userEmailTakenBadRequest,
        name: nameIsNotEmpty,
        displayName: displayNameIsNotEmpty,
        phoneNumber: phoneNumberIsPhoneNumber,
        misc: internalServerError,
      },
    },
  },
};

export const Pending: Story = { args: { registerPending: true } };
