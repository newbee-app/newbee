import { CommonModule } from '@angular/common';
import { ErrorFooterComponentModule } from '@newbee/newbee/shared/ui';
import { testBaseMagicLinkLoginDto1 } from '@newbee/shared/data-access';
import { internalServerError } from '@newbee/shared/util';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
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
  argTypes: {
    resendLink: { action: 'resendLink' },
  },
} as Meta<JwtIdComponent>;

type Story = StoryObj<JwtIdComponent>;

export const NoError: Story = {};

export const WithError: Story = {
  args: {
    httpClientError: { status: 500, messages: { misc: internalServerError } },
  },
};
