import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
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
    border: true,
    placeholder: true,
  },
} as Meta<SearchbarComponent>;

const Template: Story<SearchbarComponent> = (args: SearchbarComponent) => ({
  props: { ...args, search: action('search') },
});

export const Primary = Template.bind({});

export const NoPlaceholder = Template.bind({});
NoPlaceholder.args = {
  placeholder: false,
};

export const Borderless = Template.bind({});
Borderless.args = {
  border: false,
};
