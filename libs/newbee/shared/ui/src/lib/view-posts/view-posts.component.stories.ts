import { OrgMemberPostTab } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testPaginatedResultsDocQueryResult1,
  testPaginatedResultsQnaQueryResult1,
} from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { ViewPostsComponent } from './view-posts.component';

export default {
  title: 'ViewPostsComponent',
  component: ViewPostsComponent,
  args: {
    httpClientError: null,
    postType: 'doc',
    orgMemberTab: null,
    posts: testPaginatedResultsDocQueryResult1,
    getPostsPending: false,
  },
  argTypes: {
    orgMemberTabChange: { action: 'orgMemberTabChange' },
    orgNavigate: { action: 'orgNavigate' },
    search: { action: 'search' },
    continueSearch: { action: 'continueSearch' },
  },
} as Meta<ViewPostsComponent>;

type Story = StoryObj<ViewPostsComponent>;

export const Primary: Story = {};

export const Qnas: Story = {
  args: {
    postType: 'qna',
    posts: testPaginatedResultsQnaQueryResult1,
  },
};

export const OrgMemberPosts: Story = {
  args: {
    orgMemberTab: OrgMemberPostTab.All,
  },
};

export const Pending: Story = { args: { getPostsPending: true } };

export const WithErrors: Story = {
  args: {
    httpClientError: {
      status: 400,
      messages: { [Keyword.Misc]: 'Misc error' },
    },
  },
};
