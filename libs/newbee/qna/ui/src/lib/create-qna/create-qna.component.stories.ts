import { AppWrapperComponent } from '@newbee/newbee/shared/ui';
import { Keyword, testTeam1 } from '@newbee/shared/util';
import {
  Meta,
  StoryObj,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import { CreateQnaComponent } from './create-qna.component';

export default {
  title: 'CreateQnaComponent',
  component: CreateQnaComponent,
  decorators: [
    moduleMetadata({ imports: [AppWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-app-wrapper>${story}</newbee-app-wrapper>`,
    ),
  ],
  args: {
    httpClientError: null,
    createPending: false,
    teams: [testTeam1],
    teamSlugParam: null,
  },
  argTypes: {
    create: { action: 'create' },
  },
} as Meta<CreateQnaComponent>;

type Story = StoryObj<CreateQnaComponent>;

export const Primary: Story = {};

export const CreatePending: Story = { args: { createPending: true } };

export const WithTeamSlug: Story = { args: { teamSlugParam: testTeam1.slug } };

export const WithErrors: Story = {
  args: {
    httpClientError: {
      status: 400,
      messages: {
        title: 'Title error',
        [Keyword.Question]: 'Question error',
        [Keyword.Answer]: 'Answer error',
        [Keyword.Team]: 'Team error',
        [Keyword.Misc]: 'Misc error',
      },
    },
  },
};
