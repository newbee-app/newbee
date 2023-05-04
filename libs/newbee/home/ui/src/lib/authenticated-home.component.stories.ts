import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticatedNavbarComponent } from '@newbee/newbee/navbar/ui';
import { SearchbarComponent } from '@newbee/newbee/shared/ui';
import {
  testSelectOptionString1,
  testSelectOptionString2,
} from '@newbee/newbee/shared/util';
import { testUser1 } from '@newbee/shared/util';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { AuthenticatedHomeComponent } from './authenticated-home.component';

export default {
  title: 'AuthenticatedHomeComponent',
  component: AuthenticatedHomeComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        AuthenticatedNavbarComponent,
        SearchbarComponent,
      ],
    }),
  ],
  args: {
    userDisplayName: testUser1.displayName,
    organizations: [testSelectOptionString1, testSelectOptionString2],
    selectedOrganization: testSelectOptionString1,
  },
  argTypes: {
    selectedOrganizationChange: { action: 'selectedOrganizationChange' },
    search: { action: 'search' },
    suggest: { action: 'suggest' },
    navigateToLink: { action: 'navigateToLink' },
    logout: { action: 'logout' },
  },
} as Meta<AuthenticatedHomeComponent>;

type Story = StoryObj<AuthenticatedHomeComponent>;

export const HasOrgs: Story = {};

export const NoOrgSelected: Story = {
  args: { selectedOrganization: null },
};

export const NoOrgs: Story = {
  args: { organizations: [] },
};
