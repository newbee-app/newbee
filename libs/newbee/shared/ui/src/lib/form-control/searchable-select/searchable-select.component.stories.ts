import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  Country,
  testSelectOption1,
  testSelectOption2,
} from '@newbee/newbee/shared/util';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { ErrorFooterComponent } from '../../error-footer/error-footer.component';
import { SearchbarComponent } from '../../searchbar/searchbar.component';
import { ClickWrapperComponent } from '../../testing';
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
        ErrorFooterComponent,
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
  args: { options: [testSelectOption1, testSelectOption2] },
};

export const Long: Story = {
  args: {
    options: [
      testSelectOption1,
      testSelectOption1,
      testSelectOption1,
      testSelectOption1,
      testSelectOption1,
      testSelectOption1,
      testSelectOption1,
      testSelectOption1,
      testSelectOption1,
      testSelectOption1,
      testSelectOption1,
      testSelectOption1,
    ],
  },
};

export const Invalid: Story = {
  args: {
    options: [testSelectOption1, testSelectOption2],
    valid: false,
    errorText: 'Invalid',
  },
};
