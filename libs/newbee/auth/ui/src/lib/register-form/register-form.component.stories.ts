import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ButtonWithSpinnerComponentModule,
  ClickWrapperComponentModule,
  ErrorFooterComponentModule,
  PhoneInputComponentModule,
} from '@newbee/newbee/shared/ui';
import {
  displayNameIsNotEmpty,
  internalServerError,
  nameIsNotEmpty,
  phoneNumberIsPhoneNumber,
  userEmailTakenBadRequest,
} from '@newbee/shared/util';
import { action } from '@storybook/addon-actions';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  Story,
} from '@storybook/angular';
import { BaseFormComponentModule } from '../base-form';
import { RegisterFormComponent } from './register-form.component';

export default {
  title: 'RegisterFormComponent',
  component: RegisterFormComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        BaseFormComponentModule,
        PhoneInputComponentModule,
        ClickWrapperComponentModule,
        ButtonWithSpinnerComponentModule,
        ErrorFooterComponentModule,
      ],
    }),
    componentWrapperDecorator(
      (story) => `
      <newbee-click-wrapper>
        ${story}
      </newbee-click-wrapper>
      `
    ),
  ],
  args: {
    registerPending: false,
    httpClientError: null,
  },
} as Meta<RegisterFormComponent>;

const Template: Story<RegisterFormComponent> = (
  args: RegisterFormComponent
) => ({
  props: {
    ...args,
    register: action('register'),
    navigateToLogin: action('navigateToLogin'),
  },
});

export const WithoutErrors = Template.bind({});

export const WithErrors = Template.bind({});
WithErrors.args = {
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
};
