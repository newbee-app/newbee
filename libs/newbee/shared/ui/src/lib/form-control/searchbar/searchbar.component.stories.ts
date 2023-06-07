import { Meta, StoryObj } from '@storybook/angular';
import { SearchbarComponent } from './searchbar.component';

export default {
  title: 'SearchbarComponent',
  component: SearchbarComponent,
  args: {
    placeholder: true,
    includeSearchSymbol: true,
    includeClearSymbol: true,
  },
} as Meta<SearchbarComponent>;

type Story = StoryObj<SearchbarComponent>;

export const Primary: Story = {};

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
