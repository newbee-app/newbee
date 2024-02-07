import {
  emailUnverifiedForbiddenError,
  forbiddenError,
} from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { ForbiddenErrorComponent } from './forbidden-error.component';

export default {
  title: 'Error/ForbiddenErrorComponent',
  component: ForbiddenErrorComponent,
  args: {
    httpScreenError: { status: 403, message: forbiddenError },
  },
  argTypes: {
    navigate: { action: 'navigate' },
  },
} as Meta<ForbiddenErrorComponent>;

type Story = StoryObj<ForbiddenErrorComponent>;

export const Primary: Story = {};

export const EmailUnverified: Story = {
  args: {
    httpScreenError: { status: 403, message: emailUnverifiedForbiddenError },
  },
};
