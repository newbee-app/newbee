import { Meta, StoryObj } from '@storybook/angular';
import { TooltipComponent } from './tooltip.component';

export default {
  title: 'TooltipComponent',
  component: TooltipComponent,
  parameters: { layout: 'centered' },
  args: { text: `I'm a tooltip`, placement: 'top' },
  render: (args) => ({
    props: args,
    template: `
    <div class="w-fit">
      <newbee-tooltip [text]="text" [placement]="placement">
        <button type="button" class="btn btn-primary">Hover me</button>
      </newbee-tooltip>
    </div>
    `,
  }),
} as Meta<TooltipComponent>;

type Story = StoryObj<TooltipComponent>;

export const Top: Story = {};

export const Bottom: Story = { args: { placement: 'bottom' } };

export const Left: Story = { args: { placement: 'left' } };

export const Right: Story = { args: { placement: 'right' } };
