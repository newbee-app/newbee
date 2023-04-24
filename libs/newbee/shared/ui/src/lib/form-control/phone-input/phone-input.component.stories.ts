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
import { ErrorFooterComponentModule } from '../../error-footer/error-footer.component';
import { ClickWrapperComponentModule } from '../../testing';
import { SearchableSelectComponentModule } from '../searchable-select/searchable-select.component';
import { PhoneInputComponent } from './phone-input.component';

export default {
  title: 'PhoneInputComponent',
  component: PhoneInputComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        SearchableSelectComponentModule,
        PhoneNumberInputDirectiveModule,
        PhoneNumberPipeModule,
        ErrorFooterComponentModule,
        ClickWrapperComponentModule,
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
