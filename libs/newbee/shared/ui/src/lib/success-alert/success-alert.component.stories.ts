import { Meta, StoryObj } from '@storybook/angular';
import { SuccessAlertComponent } from './success-alert.component';

export default {
  title: 'SuccessAlertComponent',
  component: SuccessAlertComponent,
  args: {
    text: 'Success!',
  },
} as Meta<SuccessAlertComponent>;

type Story = StoryObj<SuccessAlertComponent>;

export const Primary: Story = {};
