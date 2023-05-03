import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  Country,
  testSelectOptionCountry1,
  testSelectOptionCountry2,
} from '@newbee/newbee/shared/util';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { ErrorAlertComponent } from '../../error-alert/error-alert.component';
import { ClickWrapperComponent } from '../../testing';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { SearchableSelectComponent } from './searchable-select.component';

export default {
  title: 'SearchableSelectComponent',
  component: SearchableSelectComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        SearchbarComponent,
        ErrorAlertComponent,
        ClickWrapperComponent,
      ],
    }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`
    ),
  ],
  args: {
    optionName: 'Country',
    valid: true,
    errorText: '',
  },
  argTypes: {
    exited: { action: 'exited' },
  },
} as Meta<SearchableSelectComponent<Country>>;

type Story = StoryObj<SearchableSelectComponent<Country>>;

export const Short: Story = {
  args: { options: [testSelectOptionCountry1, testSelectOptionCountry2] },
};

export const Long: Story = {
  args: {
    options: [
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
    ],
  },
};

export const Invalid: Story = {
  args: {
    options: [testSelectOptionCountry1, testSelectOptionCountry2],
    valid: false,
    errorText: 'Invalid',
  },
};
