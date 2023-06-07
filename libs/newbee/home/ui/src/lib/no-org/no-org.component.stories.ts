import { Meta, StoryObj } from '@storybook/angular';
import { NoOrgComponent } from './no-org.component';

export default {
  title: 'NoOrgComponent',
  component: NoOrgComponent,
  argTypes: {
    navigateToLink: { action: 'navigateToLink' },
  },
} as Meta<NoOrgComponent>;

type Story = StoryObj<NoOrgComponent>;

export const Primary: Story = {};
