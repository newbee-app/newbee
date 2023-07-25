import { testPost1 } from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { UpToDateBtnComponent } from './up-to-date-btn.component';

export default {
  title: 'UpToDateBtnComponent',
  component: UpToDateBtnComponent,
  parameters: { layout: 'centered' },
  args: { post: testPost1 },
} as Meta<UpToDateBtnComponent>;

type Story = StoryObj<UpToDateBtnComponent>;

export const Primary: Story = {};
