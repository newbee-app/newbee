import { Meta, StoryObj } from '@storybook/angular';
import { ViewAllCardBtnComponent } from './view-all-card-btn.component';

export default {
  title: 'ViewAllCardBtnComponent',
  component: ViewAllCardBtnComponent,
  argTypes: { clicked: { action: 'clicked' } },
} as Meta<ViewAllCardBtnComponent>;

type Story = StoryObj<ViewAllCardBtnComponent>;

export const Primary: Story = {};
