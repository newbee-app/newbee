import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { range } from 'lodash-es';
import { AppWrapperComponent } from '../../testing';
import { SearchbarComponent } from './searchbar.component';

export default {
  title: 'Form Control/SearchbarComponent',
  component: SearchbarComponent,
  decorators: [
    moduleMetadata({ imports: [AppWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-app-wrapper>${story}</newbee-app-wrapper>`,
    ),
  ],
  args: {
    placeholder: true,
    includeSearchSymbol: true,
    includeClearSymbol: true,
    suggestions: [],
  },
  argTypes: {
    selectSuggestion: { action: 'selectSuggestion' },
  },
} as Meta<SearchbarComponent>;

type Story = StoryObj<SearchbarComponent>;

export const Primary: Story = {};

export const Suggestions: Story = {
  args: { suggestions: range(10).map((num) => `suggestion ${num}`) },
};

export const NoPlaceholder: Story = {
  args: { placeholder: false },
};

export const NoSearchSymbol: Story = {
  args: { includeSearchSymbol: false },
};

export const NoClearSymbol: Story = {
  args: { includeClearSymbol: false },
};

export const NoSymbols: Story = {
  args: { includeSearchSymbol: false, includeClearSymbol: false },
};
