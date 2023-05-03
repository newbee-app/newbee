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
