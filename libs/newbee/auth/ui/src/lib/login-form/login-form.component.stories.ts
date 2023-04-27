import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorAlertComponent } from '@newbee/newbee/shared/ui';
import { internalServerError, userEmailNotFound } from '@newbee/shared/util';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { BaseFormComponent } from '../base-form';
import { LoginFormComponent } from './login-form.component';

export default {
  title: 'LoginFormComponent',
  component: LoginFormComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        BaseFormComponent,
        ErrorAlertComponent,
      ],
    }),
  ],
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
      messages: { email: userEmailNotFound, misc: internalServerError },
    },
  },
};
