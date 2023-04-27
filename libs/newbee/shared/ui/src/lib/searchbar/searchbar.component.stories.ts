import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { SearchbarComponent } from './searchbar.component';

export default {
  title: 'SearchbarComponent',
  component: SearchbarComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ReactiveFormsModule],
    }),
  ],
  args: {
    placeholder: true,
    searchTerm: '',
  },
  argTypes: {
    searchTermChange: { action: 'searchTermChange' },
  },
} as Meta<SearchbarComponent>;

type Story = StoryObj<SearchbarComponent>;

export const Primary: Story = {};

export const NoPlaceholder: Story = {
  args: { placeholder: false },
};

export const InitialSearchValue: Story = {
  args: { searchTerm: 'Searching' },
};
