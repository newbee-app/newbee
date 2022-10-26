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
import { MagicLinkLoginBaseFormModule } from '../../base-form';
import { MagicLinkLoginRegisterFormComponent } from './magic-link-login-register-form.component';

export default {
  title: 'MagicLinkLoginRegisterFormComponent',
  component: MagicLinkLoginRegisterFormComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MagicLinkLoginBaseFormModule,
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
} as Meta<MagicLinkLoginRegisterFormComponent>;

const Template: Story<MagicLinkLoginRegisterFormComponent> = (
  args: MagicLinkLoginRegisterFormComponent
) => ({
  props: {
    ...args,
    register: action('register'),
    navigateToLogin: action('navigateToLogin'),
  },
});

export const Primary = Template.bind({});
Primary.args = {};
