import { Meta, StoryObj } from '@storybook/angular';
import { ToastComponent } from './toast.component';

export default {
  title: 'ToastComponent',
  component: ToastComponent,
  args: {
    header: 'Header',
    text: 'Text',
    type: 'error',
    position: ['bottom', 'center'],
    duration: null,
  },
} as Meta<ToastComponent>;

type Story = StoryObj<ToastComponent>;

export const Primary: Story = {};

export const FiveSecs: Story = { args: { duration: 5000 } };

export const NoWords: Story = {
  args: { header: '', text: '' },
};
