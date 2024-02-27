import { SearchTab } from '@newbee/newbee/search/util';
import { ClickWrapperComponent } from '@newbee/newbee/shared/ui';
import {
  Keyword,
  testDocSearchResult1,
  testOrgMemberSearchResult1,
  testOrgSearchResultsDto1,
  testQnaSearchResult1,
  testTeamSearchResult1,
} from '@newbee/shared/util';
import {
  Meta,
  StoryObj,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import { SearchResultsComponent } from './search-results.component';

export default {
  title: 'SearchResultsComponent',
  component: SearchResultsComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`,
    ),
  ],
  args: {
    httpClientError: null,
    initialSearchTerm: '',
    tab: SearchTab.All,
    searchSuggestions: [],
    searchResults: {
      ...testOrgSearchResultsDto1,
      total: 100,
      results: [
        testTeamSearchResult1,
        testOrgMemberSearchResult1,
        testDocSearchResult1,
        testQnaSearchResult1,
        testTeamSearchResult1,
        testOrgMemberSearchResult1,
        testDocSearchResult1,
        testQnaSearchResult1,
      ],
    },
    searchPending: false,
    continueSearchPending: false,
  },
  argTypes: {
    tabChange: { action: 'tabChange' },
    search: { action: 'search' },
    searchbar: { action: 'searchbar' },
    orgNavigate: { action: 'orgNavigate' },
    continueSearch: { action: 'continueSearch' },
  },
} as Meta<SearchResultsComponent>;

type Story = StoryObj<SearchResultsComponent>;

export const Primary: Story = {};

export const SpellcheckSuggestion: Story = {
  args: {
    searchResults: { ...testOrgSearchResultsDto1, suggestion: 'this thing' },
  },
};

export const InitialSearchTerm: Story = {
  args: { initialSearchTerm: 'searching' },
};

export const Suggestions: Story = {
  args: {
    ...InitialSearchTerm.args,
    searchSuggestions: ['searching this', 'searching that'],
  },
};

export const SearchPending: Story = {
  args: { searchPending: true },
};

export const ContinueSearchPending: Story = {
  args: { continueSearchPending: true },
};

export const WithErrors: Story = {
  args: {
    httpClientError: {
      status: 400,
      messages: { [Keyword.Misc]: 'Misc error' },
    },
  },
};
