import { SearchTab } from '@newbee/newbee/search/util';
import { AppWrapperComponent } from '@newbee/newbee/shared/ui';
import {
  testDocQueryResult1,
  testOrgMemberQueryResult1,
  testQnaQueryResult1,
  testQueryResult1,
  testTeamQueryResult1,
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
    moduleMetadata({ imports: [AppWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-app-wrapper>${story}</newbee-app-wrapper>`,
    ),
  ],
  args: {
    initialSearchTerm: '',
    tab: SearchTab.All,
    searchSuggestions: [],
    searchResults: {
      ...testQueryResult1,
      total: 100,
      results: [
        testTeamQueryResult1,
        testOrgMemberQueryResult1,
        testDocQueryResult1,
        testQnaQueryResult1,
        testTeamQueryResult1,
        testOrgMemberQueryResult1,
        testDocQueryResult1,
        testQnaQueryResult1,
      ],
    },
    searchPending: false,
  },
  argTypes: {
    tabChange: { action: 'tabChange' },
    search: { action: 'search' },
    searchbar: { action: 'searchbar' },
    orgNavigate: { action: 'orgNavigate' },
    scrolled: { action: 'scrolled' },
  },
} as Meta<SearchResultsComponent>;

type Story = StoryObj<SearchResultsComponent>;

export const Primary: Story = {};

export const SpellcheckSuggestion: Story = {
  args: { searchResults: { ...testQueryResult1, suggestion: 'this thing' } },
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
  args: { searchResults: null, searchPending: true },
};
