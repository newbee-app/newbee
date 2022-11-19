import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ClickWrapperComponentModule,
  PhoneInputComponentModule,
  TooltipComponentModule,
} from '@newbee/newbee/shared/ui';
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
        TooltipComponentModule,
        PhoneInputComponentModule,
        ClickWrapperComponentModule,
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

export const Primary = Template.bind({});
Primary.args = {};
