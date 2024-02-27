import {
  testDocSearchResult1,
  testQnaSearchResult1,
} from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { PostSearchResultHeaderComponent } from './post-search-result-header.component';

export default {
  title: 'Search Result/Header/PostSearchResultHeaderComponent',
  component: PostSearchResultHeaderComponent,
  args: {
    searchResult: testDocSearchResult1,
  },
  argTypes: { orgNavigate: { action: 'orgNavigate' } },
} as Meta<PostSearchResultHeaderComponent>;

type Story = StoryObj<PostSearchResultHeaderComponent>;

export const Doc: Story = {};

export const Qna: Story = { args: { searchResult: testQnaSearchResult1 } };

export const NoMaintainer: Story = {
  args: { searchResult: { ...testDocSearchResult1, maintainer: null } },
};

export const NoCreator: Story = {
  args: { searchResult: { ...testDocSearchResult1, creator: null } },
};

export const NoTeam: Story = {
  args: { searchResult: { ...testDocSearchResult1, team: null } },
};

export const NoRelations: Story = {
  args: {
    searchResult: {
      ...testDocSearchResult1,
      maintainer: null,
      creator: null,
      team: null,
    },
  },
};
