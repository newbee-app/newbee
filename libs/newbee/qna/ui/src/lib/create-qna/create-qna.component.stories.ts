import { Keyword } from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { CreateQnaComponent } from './create-qna.component';

export default {
  title: 'CreateQnaComponent',
  component: CreateQnaComponent,
  args: {
    httpClientError: null,
    createPending: false,
  },
  argTypes: {
    create: { action: 'create' },
  },
} as Meta<CreateQnaComponent>;

type Story = StoryObj<CreateQnaComponent>;

export const Primary: Story = {};

export const CreatePending: Story = { args: { createPending: true } };

export const WithErrors: Story = {
  args: {
    httpClientError: {
      status: 400,
      messages: {
        title: 'Title error',
        [Keyword.Misc]: 'Misc error',
      },
    },
  },
};
