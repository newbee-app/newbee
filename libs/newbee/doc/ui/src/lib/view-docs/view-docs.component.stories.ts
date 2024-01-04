import { ClickWrapperComponent } from '@newbee/newbee/shared/ui';
import { testDocQueryResult1, testQueryResult1 } from '@newbee/shared/util';
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
    docs: {
      ...testQueryResult1,
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
    searchSuggestions: [],
    searchParam: null,
    searchPending: false,
  },
  argTypes: {
    search: { action: 'search' },
    searchbar: { action: 'searchbar' },
    orgNavigate: { action: 'orgNavigate' },
    scrolled: { action: 'scrolled' },
  },
} as Meta<ViewDocsComponent>;

type Story = StoryObj<ViewDocsComponent>;

export const Primary: Story = {};

export const SpellcheckSuggestion: Story = {
  args: {
    docs: {
      ...testQueryResult1,
      suggestion: 'this thing',
      results: [testDocQueryResult1],
    },
  },
};

export const Suggestions: Story = {
  args: {
    searchSuggestions: ['searching this', 'searching that'],
  },
};

export const SearchParam: Story = {
  args: {
    searchParam: 'search param',
  },
};

export const SearchPending: Story = {
  args: {
    searchPending: true,
  },
};
