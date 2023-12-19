import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { AppWrapperComponent } from '../../testing';
import { DropdownComponent } from './dropdown.component';

export default {
  title: 'Dropdown/DropdownComponent',
  component: DropdownComponent,
  decorators: [
    moduleMetadata({ imports: [AppWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-app-wrapper>${story}</newbee-app-wrapper>`,
    ),
  ],
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    placement: 'bottom',
    offset: 10,
    expandStrategy: 'toggle',
    portal: true,
    dropdownNoToggleElements: [],
    expanded: false,
  },
  argTypes: {
    expandedChange: { action: 'expandedChange' },
  },
  render: (args) => ({
    props: args,
    template: `
    <div class="w-fit">
      <newbee-dropdown [disabled]="disabled" [placement]="placement" [offset]="offset" [expandStrategy]="expandStrategy" [portal]="portal" [dropdownNoToggleElements]="dropdownNoToggleElements" [expanded]="expanded" (expandedChange)="expandedChange($event)">
        <button label type="button" class="btn btn-primary">Click me</button>

        <div dropdown class="flex flex-col flex-nowrap">
          <button type="button" class="btn btn-ghost justify-start text-left normal-case font-normal">A somewhat long message in this button</button>
        </div>
      </newbee-dropdown>
    </div>
    `,
  }),
} as Meta<DropdownComponent>;

type Story = StoryObj<DropdownComponent>;

export const Bottom: Story = {};

export const Top: Story = { args: { placement: 'top' } };

export const Left: Story = { args: { placement: 'left' } };

export const Right: Story = { args: { placement: 'right' } };

export const NoOffset: Story = { args: { offset: 0 } };

export const Expand: Story = { args: { expandStrategy: 'expand' } };
