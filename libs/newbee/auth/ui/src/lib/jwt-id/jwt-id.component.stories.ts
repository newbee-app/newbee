import { CommonModule } from '@angular/common';
import { testMagicLinkLoginDto1 } from '@newbee/shared/data-access';
import { action } from '@storybook/addon-actions';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { BaseFormComponentModule } from '../base-form';
import { JwtIdComponent } from './jwt-id.component';

export default {
  title: 'JwtIdComponent',
  component: JwtIdComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, BaseFormComponentModule],
    }),
  ],
} as Meta<JwtIdComponent>;

const Template: Story<JwtIdComponent> = (args: JwtIdComponent) => ({
  props: {
    ...args,
    resendLink: action('resendLink'),
  },
});

export const Primary = Template.bind({});
Primary.args = {
  jwtId: testMagicLinkLoginDto1.jwtId,
  email: testMagicLinkLoginDto1.email,
};
