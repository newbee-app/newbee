import { ClickWrapperComponent } from '@newbee/newbee/shared/ui';
import {
  Keyword,
  testDocQueryResult1,
  testPaginatedResultsDocQueryResult1,
  testPaginatedResultsQnaQueryResult1,
} from '@newbee/shared/util';
import {
  Meta,
  StoryObj,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import { ViewDocsComponent } from './view-docs.component';

export default {
  title: 'ViewDocsComponent',
  component: ViewDocsComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`,
    ),
  ],
  args: {
    httpClientError: null,
    docs: testPaginatedResultsDocQueryResult1,
    getDocsPending: false,
  },
  argTypes: {
    orgNavigate: { action: 'orgNavigate' },
    search: { action: 'search' },
    scrolled: { action: 'scrolled' },
  },
} as Meta<ViewDocsComponent>;

type Story = StoryObj<ViewDocsComponent>;

export const Primary: Story = {};

export const LotsOfDocs: Story = {
  args: {
    docs: {
      ...testPaginatedResultsQnaQueryResult1,
      total: 100,
      results: [
        testDocQueryResult1,
        testDocQueryResult1,
        testDocQueryResult1,
        testDocQueryResult1,
        testDocQueryResult1,
        testDocQueryResult1,
        testDocQueryResult1,
        testDocQueryResult1,
        testDocQueryResult1,
        testDocQueryResult1,
      ],
    },
  },
};

export const GetDocsPending: Story = {
  args: {
    getDocsPending: true,
  },
};

export const WithErrors: Story = {
  args: {
    httpClientError: {
      status: 400,
      messages: { [Keyword.Misc]: 'Misc error' },
    },
  },
};
