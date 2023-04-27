import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ClickWrapperComponent,
  ErrorAlertComponent,
  PhoneInputComponent,
} from '@newbee/newbee/shared/ui';
import {
  displayNameIsNotEmpty,
  internalServerError,
  nameIsNotEmpty,
  phoneNumberIsPhoneNumber,
  userEmailTakenBadRequest,
} from '@newbee/shared/util';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { BaseFormComponent } from '../base-form';
import { RegisterFormComponent } from './register-form.component';

export default {
  title: 'RegisterFormComponent',
  component: RegisterFormComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        BaseFormComponent,
        PhoneInputComponent,
        ErrorAlertComponent,
        ClickWrapperComponent,
      ],
    }),
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

export const WithErrors = {
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
