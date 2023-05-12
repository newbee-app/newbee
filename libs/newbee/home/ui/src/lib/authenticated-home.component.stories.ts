import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticatedNavbarComponent } from '@newbee/newbee/navbar/ui';
import { SearchbarComponent } from '@newbee/newbee/shared/ui';
import {
  testSelectOptionOrganization1,
  testSelectOptionOrganization2,
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
    user: testUser1,
    organizations: [
      testSelectOptionOrganization1,
      testSelectOptionOrganization2,
    ],
    selectedOrganization: testSelectOptionOrganization1,
  },
  argTypes: {
    selectedOrganizationChange: { action: 'selectedOrganizationChange' },
    search: { action: 'search' },
    searchbar: { action: 'searchbar' },
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
