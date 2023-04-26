import { CommonModule } from '@angular/common';
import {
  ClickWrapperComponent,
  DropdownComponent,
} from '@newbee/newbee/shared/ui';
import {
  testSelectOptionString1,
  testSelectOptionString2,
} from '@newbee/newbee/shared/util';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { AuthenticatedOrganizationComponent } from './authenticated-organization.component';

export default {
  title: 'AuthenticatedOrganizationComponent',
  component: AuthenticatedOrganizationComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, DropdownComponent, ClickWrapperComponent],
    }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`
    ),
  ],
  args: {
    selectedOrganization: testSelectOptionString1,
    organizations: [testSelectOptionString1],
  },
  argTypes: {
    selectedOrganizationChange: { action: 'selectedOrganizationChange' },
  },
} as Meta<AuthenticatedOrganizationComponent>;

type Story = StoryObj<AuthenticatedOrganizationComponent>;

export const OneOrg: Story = {
  render: (args) => ({
    props: args,
    template: `<newbee-authenticated-organization [organizations]="organizations" [(selectedOrganization)]="selectedOrganization" (selectedOrganizationChange)="selectedOrganizationChange($event)"></newbee-authenticated-organization>`,
  }),
};

export const Short: Story = {
  ...OneOrg,
  args: {
    organizations: [testSelectOptionString1, testSelectOptionString2],
  },
};

export const Long: Story = {
  ...OneOrg,
  args: {
    selectedOrganization: testSelectOptionString2,
    organizations: [
      testSelectOptionString1,
      testSelectOptionString2,
      testSelectOptionString1,
      testSelectOptionString1,
      testSelectOptionString1,
      testSelectOptionString1,
      testSelectOptionString1,
      testSelectOptionString1,
      testSelectOptionString1,
      testSelectOptionString1,
      testSelectOptionString1,
      testSelectOptionString1,
      testSelectOptionString1,
      testSelectOptionString1,
      testSelectOptionString1,
      testSelectOptionString1,
      testSelectOptionString1,
    ],
  },
};
