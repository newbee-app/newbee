import { AppWrapperComponent } from '@newbee/newbee/shared/ui';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { OrgSearchbarComponent } from './org-searchbar.component';

export default {
  title: 'OrgSearchbarComponent',
  component: OrgSearchbarComponent,
  decorators: [
    moduleMetadata({ imports: [AppWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-app-wrapper>${story}</newbee-app-wrapper>`,
    ),
  ],
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
