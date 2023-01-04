import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ButtonWithSpinnerComponentModule,
  ErrorFooterComponentModule,
} from '@newbee/newbee/shared/ui';
import { action } from '@storybook/addon-actions';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { BaseFormComponentModule } from '../base-form';
import { LoginFormComponent } from './login-form.component';

export default {
  title: 'LoginFormComponent',
  component: LoginFormComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        BaseFormComponentModule,
        ButtonWithSpinnerComponentModule,
        ErrorFooterComponentModule,
      ],
    }),
  ],
  args: {
    loginPending: false,
    magicLinkPending: false,
  },
} as Meta<LoginFormComponent>;

const Template: Story<LoginFormComponent> = (args: LoginFormComponent) => ({
  props: {
    ...args,
    magicLinkLogin: action('magicLinkLogin'),
    webauthn: action('webauthn'),
    navigateToRegister: action('navigateToRegister'),
  },
});

export const Primary = Template.bind({});
Primary.args = {};
