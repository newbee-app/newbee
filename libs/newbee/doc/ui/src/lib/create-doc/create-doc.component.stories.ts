import { ClickWrapperComponent } from '@newbee/newbee/shared/ui';
import {
  Keyword,
  testOrganization1,
  testTeam1,
  testTeamMemberRelation1,
} from '@newbee/shared/util';
import {
  Meta,
  StoryObj,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import { CreateDocComponent } from './create-doc.component';

export default {
  title: 'CreateDocComponent',
  component: CreateDocComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`,
    ),
  ],
  args: {
    httpClientError: null,
    createPending: false,
    organization: testOrganization1,
    teams: [testTeamMemberRelation1],
    teamSlugParam: testTeam1.slug,
  },
  argTypes: {
    create: { action: 'create' },
  },
} as Meta<CreateDocComponent>;

type Story = StoryObj<CreateDocComponent>;

export const Primary: Story = {};

export const NoTeamSlugParam: Story = {
  args: { teamSlugParam: null },
};

export const Pending: Story = {
  args: { createPending: true },
};

export const TeamWithDuration: Story = {
  args: {
    teams: [
      {
        ...testTeamMemberRelation1,
        team: { ...testTeam1, upToDateDuration: 'P1Y' },
      },
    ],
  },
};

export const WithErrors: Story = {
  args: {
    httpClientError: {
      status: 400,
      messages: {
        [Keyword.Team]: 'Team error',
        num: 'Num error',
        frequency: 'Frequency error',
        duration: 'Duration error',
        title: 'Title error',
        [Keyword.Doc]: 'Doc error',
        [Keyword.Misc]: 'Misc error',
      },
    },
  },
};
