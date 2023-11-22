import { ClickWrapperComponent } from '@newbee/newbee/shared/ui';
import { Keyword, testOrganization1, testTeam1 } from '@newbee/shared/util';
import {
  Meta,
  StoryObj,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import { CreateTeamComponent } from './create-team.component';

export default {
  title: 'CreateTeamComponent',
  component: CreateTeamComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`,
    ),
  ],
  args: {
    organization: testOrganization1,
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

export const WithErrors: Story = {
  args: {
    httpClientError: {
      status: 400,
      messages: {
        name: 'Name error',
        slug: 'Slug error',
        [Keyword.Duration]: 'Duration error',
        misc: 'Misc error',
      },
    },
  },
};
