import { testToast1 } from '@newbee/newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { ToastComponent } from './toast.component';

export default {
  title: 'ToastComponent',
  component: ToastComponent,
  args: {
    toast: testToast1,
  },
  argTypes: {
    dismissed: { action: 'dismissed' },
  },
} as Meta<ToastComponent>;

type Story = StoryObj<ToastComponent>;

export const OneSec: Story = {};

export const NoTimer: Story = {
  args: { toast: { ...testToast1, duration: null } },
};

export const NoWords: Story = {
  args: { toast: { ...testToast1, header: '', text: '' } },
};
