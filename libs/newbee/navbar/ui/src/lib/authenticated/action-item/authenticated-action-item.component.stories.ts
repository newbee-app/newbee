import { testUser1 } from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { AuthenticatedActionItemComponent } from './authenticated-action-item.component';

export default {
  title: 'AuthenticatedActionItemComponent',
  component: AuthenticatedActionItemComponent,
  args: {
    userName: testUser1.displayName,
  },
} as Meta<AuthenticatedActionItemComponent>;

type Story = StoryObj<AuthenticatedActionItemComponent>;

export const Primary: Story = {};
