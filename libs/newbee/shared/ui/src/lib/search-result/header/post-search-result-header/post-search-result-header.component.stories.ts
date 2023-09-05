import { testDocQueryResult1, testQnaQueryResult1 } from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { PostSearchResultHeaderComponent } from './post-search-result-header.component';

export default {
  title: 'Search Result/Header/PostSearchResultHeaderComponent',
  component: PostSearchResultHeaderComponent,
  args: {
    searchResult: testDocQueryResult1,
  },
  argTypes: { orgNavigate: { action: 'orgNavigate' } },
} as Meta<PostSearchResultHeaderComponent>;

type Story = StoryObj<PostSearchResultHeaderComponent>;

export const Doc: Story = {};

export const Qna: Story = { args: { searchResult: testQnaQueryResult1 } };

export const NoMaintainer: Story = {
  args: { searchResult: { ...testDocQueryResult1, maintainer: null } },
};

export const NoCreator: Story = {
  args: { searchResult: { ...testDocQueryResult1, creator: null } },
};

export const NoTeam: Story = {
  args: { searchResult: { ...testDocQueryResult1, team: null } },
};

export const NoRelations: Story = {
  args: {
    searchResult: {
      ...testDocQueryResult1,
      maintainer: null,
      creator: null,
      team: null,
    },
  },
};
