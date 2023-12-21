import { Meta, StoryObj } from '@storybook/angular';
import { TooltipComponent } from './tooltip.component';

export default {
  title: 'Tooltip/TooltipComponent',
  component: TooltipComponent,
  parameters: { layout: 'centered' },
  args: { placement: 'top' },
  render: (args) => ({
    props: args,
    template: `
    <div class="w-fit">
      <newbee-tooltip [placement]="placement">
        <button label type="button" class="btn btn-primary">Hover me</button>
        <span tooltip>I'm a tooltip</span>
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
