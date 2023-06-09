import {
  testOrganization1,
  testOrganization2,
  testOrgMemberRelation1,
  testUser1,
} from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { AuthenticatedNavbarComponent } from './authenticated-navbar.component';

export default {
  title: 'AuthenticatedNavbarComponent',
  component: AuthenticatedNavbarComponent,
  args: {
    user: testUser1,
    organizations: [testOrganization1, testOrganization2],
    selectedOrganization: testOrganization1,
    orgMember: testOrgMemberRelation1,
  },
  argTypes: {
    selectedOrganizationChange: { action: 'selectedOrganizationChange' },
    navigateToLink: { action: 'navigateToLink' },
    logout: { action: 'logout' },
  },
  parameters: { layout: 'fullscreen' },
} as Meta<AuthenticatedNavbarComponent>;

type Story = StoryObj<AuthenticatedNavbarComponent>;

export const SelectedOrg: Story = {};

export const NoSelectedOrg: Story = {
  args: { selectedOrganization: null },
};