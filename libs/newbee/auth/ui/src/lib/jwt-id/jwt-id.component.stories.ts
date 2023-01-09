import { CommonModule } from '@angular/common';
import { ErrorFooterComponentModule } from '@newbee/newbee/shared/ui';
import { testBaseMagicLinkLoginDto1 } from '@newbee/shared/data-access';
import { internalServerError } from '@newbee/shared/util';
import { action } from '@storybook/addon-actions';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { BaseFormComponentModule } from '../base-form';
import { JwtIdComponent } from './jwt-id.component';

export default {
  title: 'JwtIdComponent',
  component: JwtIdComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        BaseFormComponentModule,
        ErrorFooterComponentModule,
      ],
    }),
  ],
  args: {
    jwtId: testBaseMagicLinkLoginDto1.jwtId,
    email: testBaseMagicLinkLoginDto1.email,
    httpClientError: null,
  },
} as Meta<JwtIdComponent>;

const Template: Story<JwtIdComponent> = (args: JwtIdComponent) => ({
  props: {
    ...args,
    resendLink: action('resendLink'),
  },
});

export const NoError = Template.bind({});

export const WithError = Template.bind({});
WithError.args = {
  httpClientError: { status: 500, messages: { misc: internalServerError } },
};
