import {
  testOrganization1,
  testOrganization2,
  testOrgMemberRelation1,
  testUser1,
} from '@newbee/shared/util';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { ClickWrapperComponent } from '../../../testing';
import { AuthenticatedNavbarComponent } from './authenticated-navbar.component';

export default {
  title: 'Navbar/AuthenticatedNavbarComponent',
  component: AuthenticatedNavbarComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`,
    ),
  ],
  args: {
    user: testUser1,
    organizations: [testOrganization1, testOrganization2],
    selectedOrganization: testOrganization1,
    orgMember: testOrgMemberRelation1,
    includeCenter: false,
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

export const IncludeCenter: Story = { args: { includeCenter: true } };
