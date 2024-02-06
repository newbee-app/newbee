import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { ClickWrapperComponent } from '../../util';
import { DropdownComponent } from './dropdown.component';

export default {
  title: 'Dropdown/DropdownComponent',
  component: DropdownComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`,
    ),
  ],
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    placement: 'bottom',
    offset: 10,
    expandStrategy: 'toggle',
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
      <newbee-dropdown [disabled]="disabled" [placement]="placement" [offset]="offset" [expandStrategy]="expandStrategy" [dropdownNoToggleElements]="dropdownNoToggleElements" [expanded]="expanded" (expandedChange)="expandedChange($event)">
        <button label type="button" class="btn btn-primary">Click me</button>

        <ul dropdown class="menu flex flex-col flex-nowrap">
          <li><a>A somewhat long message here</a></li>
        </ul>
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
