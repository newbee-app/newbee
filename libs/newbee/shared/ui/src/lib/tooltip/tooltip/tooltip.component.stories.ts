import { Meta, StoryObj } from '@storybook/angular';
import { TooltipComponent } from './tooltip.component';

export default {
  title: 'Tooltip/TooltipComponent',
  component: TooltipComponent,
  parameters: { layout: 'centered' },
  args: {
    placement: 'top',
    offset: 10,
    includeTail: true,
    tailClasses: 'bg-neutral',
  },
  render: (args) => ({
    props: args,
    template: `
    <div class="w-fit">
      <newbee-tooltip [placement]="placement" [offset]="offset" [includeTail]="includeTail" [tailClasses]="tailClasses">
        <button label type="button" class="btn btn-primary">Hover me</button>
        <div tooltip class="bg-neutral rounded-md px-2 py-1 text-sm">I'm a tooltip</div>
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

export const NoOffset: Story = { args: { offset: 0 } };

export const NoTail: Story = { args: { includeTail: false } };
