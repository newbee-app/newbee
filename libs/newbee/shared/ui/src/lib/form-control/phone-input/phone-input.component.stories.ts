import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  PhoneNumberInputDirectiveModule,
  PhoneNumberPipeModule,
} from '@newbee/newbee/shared/util';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { ErrorAlertComponent } from '../../error-alert/error-alert.component';
import { ClickWrapperComponent } from '../../testing';
import { SearchableSelectComponent } from '../searchable-select/searchable-select.component';
import { PhoneInputComponent } from './phone-input.component';

export default {
  title: 'PhoneInputComponent',
  component: PhoneInputComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        SearchableSelectComponent,
        PhoneNumberInputDirectiveModule,
        PhoneNumberPipeModule,
        ErrorAlertComponent,
        ClickWrapperComponent,
      ],
    }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`
    ),
  ],
  parameters: { layout: 'centered' },
} as Meta<PhoneInputComponent>;

type Story = StoryObj<PhoneInputComponent>;

export const Primary: Story = {};
