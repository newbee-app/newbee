import { testOrganization1, testOrganization2 } from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { AuthenticatedSidebarComponent } from './authenticated-sidebar.component';

export default {
  title: 'Navbar/AuthenticatedSidebarComponent',
  component: AuthenticatedSidebarComponent,
  args: {
    organizations: [testOrganization1, testOrganization2],
    selectedOrganization: testOrganization1,
  },
  argTypes: {
    selectedOrganizationChange: { action: 'selectedOrganizationChange' },
    navigateToLink: { action: 'navigateToLink' },
  },
  parameters: { layout: 'fullscreen' },
} as Meta<AuthenticatedSidebarComponent>;

type Story = StoryObj<AuthenticatedSidebarComponent>;

export const SelectedOrg: Story = {};

export const NoSelectedOrg: Story = {
  args: { selectedOrganization: null },
};

export const LotsOfOrgs: Story = {
  args: {
    organizations: [
      testOrganization1,
      testOrganization1,
      testOrganization1,
      testOrganization1,
      testOrganization1,
      testOrganization1,
      testOrganization1,
      testOrganization1,
      testOrganization1,
      testOrganization1,
      testOrganization1,
      testOrganization1,
      testOrganization1,
      testOrganization1,
      testOrganization1,
      testOrganization1,
      testOrganization1,
      testOrganization1,
      testOrganization1,
      testOrganization1,
      testOrganization1,
      testOrganization1,
      testOrganization1,
      testOrganization1,
      testOrganization1,
      testOrganization1,
    ],
  },
};
