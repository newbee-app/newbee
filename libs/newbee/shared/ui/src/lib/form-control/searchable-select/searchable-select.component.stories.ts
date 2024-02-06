import {
  Country,
  testSelectOptionCountry1,
  testSelectOptionCountry2,
} from '@newbee/newbee/shared/util';
import {
  Meta,
  StoryObj,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import { ClickWrapperComponent } from '../../util';
import { SearchableSelectComponent } from './searchable-select.component';

export default {
  title: 'Form Control/SearchableSelectComponent',
  component: SearchableSelectComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`,
    ),
  ],
  args: {
    showSearchbar: true,
    options: [testSelectOptionCountry1, testSelectOptionCountry2],
    optionName: 'Country',
    valid: true,
    errorText: '',
  },
  argTypes: {
    exited: { action: 'exited' },
  },
} as Meta<SearchableSelectComponent<Country>>;

type Story = StoryObj<SearchableSelectComponent<Country>>;

export const Short: Story = {};

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

export const NoSearchbar: Story = { args: { showSearchbar: false } };
