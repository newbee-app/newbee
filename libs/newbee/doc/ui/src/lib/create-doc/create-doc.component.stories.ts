import { ClickWrapperComponent } from '@newbee/newbee/shared/ui';
import {
  Keyword,
  testOrganization1,
  testTeam1,
  testTeam2,
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
    teams: [testTeam1],
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
    teams: [testTeam2],
    teamSlugParam: testTeam2.slug,
  },
};

export const WithErrors: Story = {
  args: {
    httpClientError: {
      status: 400,
      messages: {
        title: 'Title error',
        upToDateDuration: 'Up-to-date duration error',
        [Keyword.Doc]: 'Doc error',
        [Keyword.Team]: 'Team error',
        num: 'Num error',
        frequency: 'Frequency error',
        [Keyword.Misc]: 'Misc error',
      },
    },
  },
};
