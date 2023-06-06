import { Meta, StoryObj } from '@storybook/angular';
import { OrgSearchbarComponent } from './org-searchbar.component';

export default {
  title: 'OrgSearchbarComponent',
  component: OrgSearchbarComponent,
  args: {
    searchPending: false,
  },
  argTypes: {
    search: { action: 'search' },
    searchbar: { action: 'searchbar' },
  },
} as Meta<OrgSearchbarComponent>;

type Story = StoryObj<OrgSearchbarComponent>;

export const Primary: Story = {};

export const SearchPending: Story = { args: { searchPending: true } };
