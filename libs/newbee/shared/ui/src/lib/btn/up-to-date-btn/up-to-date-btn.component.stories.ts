import { testPost1 } from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import dayjs from 'dayjs';
import { UpToDateBtnComponent } from './up-to-date-btn.component';

export default {
  title: 'Btn/UpToDateBtnComponent',
  component: UpToDateBtnComponent,
  parameters: { layout: 'centered' },
  args: { post: testPost1 },
} as Meta<UpToDateBtnComponent>;

type Story = StoryObj<UpToDateBtnComponent>;

export const UpToDate: Story = {};

export const OutOfDate: Story = {
  args: {
    post: {
      ...testPost1,
      outOfDateAt: dayjs(new Date()).subtract(1, 'year').toDate(),
    },
  },
};
