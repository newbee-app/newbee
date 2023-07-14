import { testTeam1 } from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { CreateTeamComponent } from './create-team.component';

export default {
  title: 'CreateTeamComponent',
  component: CreateTeamComponent,
  args: {
    generatedSlug: '',
    slugTaken: false,
    createPending: false,
    checkPending: false,
    httpClientError: null,
  },
  argTypes: {
    name: { action: 'name' },
    slug: { action: 'slug' },
    formattedSlug: { action: 'formattedSlug' },
    create: { action: 'create' },
  },
} as Meta<CreateTeamComponent>;

type Story = StoryObj<CreateTeamComponent>;

export const Primary: Story = {};

export const GeneratedSlug: Story = {
  args: { generatedSlug: testTeam1.slug },
};

export const SlugTaken: Story = { args: { slugTaken: true } };

export const CreatePending: Story = { args: { createPending: true } };

export const CheckPending: Story = { args: { checkPending: true } };

export const HttpError: Story = {
  args: {
    httpClientError: {
      status: 400,
      messages: { misc: 'Some error' },
    },
  },
};
