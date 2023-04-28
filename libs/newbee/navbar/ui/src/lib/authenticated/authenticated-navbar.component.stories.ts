import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchableSelectComponent } from '@newbee/newbee/shared/ui';
import {
  testSelectOptionString1,
  testSelectOptionString2,
} from '@newbee/newbee/shared/util';
import { testUser1 } from '@newbee/shared/util';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { AuthenticatedNavbarComponent } from './authenticated-navbar.component';

export default {
  title: 'AuthenticatedNavbarComponent',
  component: AuthenticatedNavbarComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ReactiveFormsModule, SearchableSelectComponent],
    }),
  ],
  args: {
    organizations: [testSelectOptionString1, testSelectOptionString2],
    selectedOrganization: testSelectOptionString1,
    userDisplayName: testUser1.displayName,
  },
  argTypes: {
    selectedOrganizationChange: { action: 'selectedOrganizationChange' },
  },
} as Meta<AuthenticatedNavbarComponent>;

type Story = StoryObj<AuthenticatedNavbarComponent>;

export const Primary: Story = {};
