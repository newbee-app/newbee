import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipComponentModule } from '@newbee/newbee/shared/ui';
import { action } from '@storybook/addon-actions';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { MagicLinkLoginBaseFormComponentModule } from '../../base-form';
import { MagicLinkLoginLoginFormComponent } from './magic-link-login-login-form.component';

export default {
  title: 'MagicLinkLoginLoginFormComponent',
  component: MagicLinkLoginLoginFormComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MagicLinkLoginBaseFormComponentModule,
        TooltipComponentModule,
      ],
    }),
  ],
} as Meta<MagicLinkLoginLoginFormComponent>;

const Template: Story<MagicLinkLoginLoginFormComponent> = (
  args: MagicLinkLoginLoginFormComponent
) => ({
  props: {
    ...args,
    login: action('login'),
    navigateToRegister: action('navigateToRegister'),
  },
});

export const Primary = Template.bind({});
Primary.args = {};
