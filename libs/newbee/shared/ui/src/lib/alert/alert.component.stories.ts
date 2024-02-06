import { AlertType, Button, testButton1 } from '@newbee/newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { AlertComponent } from './alert.component';

export default {
  title: 'AlertComponent',
  component: AlertComponent,
  args: {
    header: 'Header text',
    text: 'Some text',
    type: AlertType.Error,
    includeClearSymbol: true,
    show: true,
    customButton: null,
  },
  argTypes: {
    showChange: { action: 'showChange' },
  },
} as Meta<AlertComponent>;

type Story = StoryObj<AlertComponent>;

export const Primary: Story = {};

export const TextOnly: Story = { args: { header: '' } };

export const NoClearSymbol: Story = { args: { includeClearSymbol: false } };

export const CustomButton: Story = {
  args: {
    customButton: testButton1,
  },
};

export const CustomButtonDisabledPending: Story = {
  args: {
    customButton: new Button(
      'Click me',
      () => {
        return;
      },
      null,
      true,
      true,
    ),
  },
};

export const Info: Story = { args: { type: AlertType.Info } };

export const Success: Story = { args: { type: AlertType.Success } };

export const Warning: Story = { args: { type: AlertType.Warning } };

export const NoShow: Story = { args: { show: false } };
