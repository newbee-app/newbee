import { Meta, StoryObj } from '@storybook/angular';
import { ViewAllBtnComponent } from './view-all-btn.component';

export default {
  title: 'Btn/ViewAllBtnComponent',
  component: ViewAllBtnComponent,
  parameters: { layout: 'centered' },
  argTypes: { clicked: { action: 'clicked' } },
} as Meta<ViewAllBtnComponent>;

type Story = StoryObj<ViewAllBtnComponent>;

export const Primary: Story = {};
